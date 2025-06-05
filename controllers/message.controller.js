// controllers/messageController.js
const { Message, MessageItem, User } = require('../models');
const cloudinary = require('../utils/cloudinary'); // Đảm bảo bạn đã cấu hình Cloudinary
const streamifier = require('streamifier');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const IA_USER_ID = 'bc38c103-ab3b-4fb6-9f55-677cabd62412';

// 1. User hoặc Admin gửi tin nhắn
exports.sendMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const userRoles = await req.user.getRoles();
        const isAdmin = userRoles.some(role => role.code === 'ROLE_ADMIN');
        const { content } = req.body;
        let { recipientId } = req.body;
        let imageUrl = null;

        // Xử lý ảnh nếu có
        if (req.file) {
            const streamUpload = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream({ folder: 'messages' }, (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    });
                    streamifier.createReadStream(req.file.buffer).pipe(stream);
                });
            };
            const result = await streamUpload();
            imageUrl = result.secure_url;
        }

        let message;

        // 1. ADMIN GỬI CHO USER
        if (isAdmin) {
            if (!recipientId) return res.status(400).json({ message: 'Missing recipientId' });

            message = await Message.findOne({ where: { user_id: recipientId, type: 'admin' } });

            if (!message) {
                return res.status(404).json({ message: 'Conversation not found' });
            }

            // Check lock
            if (message.locked_by && message.locked_by !== senderId) {
                return res.status(403).json({ message: 'Conversation is being handled by another admin' });
            }

            message.locked_by = senderId;
            await message.save();

        } else {
            // 2. USER GỬI CHO ADMIN
            recipientId = null; // Không cần

            message = await Message.findOne({ where: { user_id: senderId, type: 'admin' } });

            if (!message) {
                message = await Message.create({ user_id: senderId, type: 'admin' });
            }


            if (message.is_hidden_from_admin) {
                message.is_hidden_from_admin = false;
                await message.save();
            }
        }

        // 3. Gửi tin nhắn
        const newMessageItem = await MessageItem.create({
            message_id: message.id,
            sender_id: senderId,
            content,
            image_url: imageUrl,
        });

      

        message.update_at = new Date();
        await message.save();




        // 4. Gửi socket cho admin hoặc user
        if (req.io) {
            if (isAdmin) {
                req.io.to(message.user_id).emit('new_message', {
                    message_id: message.id,
                    sender_id: senderId,
                    content,
                    image_url: imageUrl,
                    createdAt: newMessageItem.createdAt,
                    updateAt: newMessageItem.updatedAt,
                    User: { id: req.user.id, name: req.user.name, email: req.user.email, avatar_url: req.user.avatar_url },
                });
                req.io.emit('admin_send_message', {
                    message_id: message.id,
                    recipientId: recipientId,
                })
            } else {
                req.io.emit('admin_new_message', {
                    message_id: message.id,
                    sender_id: senderId,
                    content,
                    image_url: imageUrl,
                    createdAt: newMessageItem.createdAt,
                    updateAt: newMessageItem.updatedAt,
                    User: { id: req.user.id, name: req.user.name, email: req.user.email, avatar_url: req.user.avatar_url },
                });
            }
        }

        res.status(201).json({ message: 'Message sent', item: newMessageItem });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};





exports.sendMessageWithDoctor = async (req, res) => {
    try {
        const senderId = req.params.id;
        const { recipientId, content } = req.body;
        let imageUrl = null;

        if (!recipientId) {
            return res.status(400).json({ message: 'Missing recipientId' });
        }

        // Upload ảnh nếu có
        if (req.file) {
            const streamUpload = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: 'messages' },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    streamifier.createReadStream(req.file.buffer).pipe(stream);
                });
            };
            const result = await streamUpload();
            imageUrl = result.secure_url;
        }

        // Tìm hoặc tạo cuộc trò chuyện 1:1 giữa sender và recipient
        let message = await Message.findOne({
            where: {
                type: 'doctor',
                [Op.or]: [
                    { user_id: senderId, locked_by: recipientId },
                    { user_id: recipientId, locked_by: senderId },
                ],
            },
        });

        if (!message) {
            message = await Message.create({
                user_id: senderId,
                locked_by: recipientId,
                type: 'doctor',
            });
        }

        // Tạo tin nhắn mới
        const newMessageItem = await MessageItem.create({
            message_id: message.id,
            sender_id: senderId,
            content,
            image_url: imageUrl,
        });

        message.update_at = new Date();
        await message.save();

        const sender = await User.findByPk(senderId);

        // Thông tin người gửi
        const senderInfo = {
            id: sender.id,
            name: sender.name,
            email: sender.email,
            avatar_url: sender.avatar_url,
        };

        const payload = {
            message_id: message.id,
            sender_id: senderId,
            content,
            image_url: imageUrl,
            createdAt: newMessageItem.createdAt,
            updateAt: newMessageItem.updatedAt,
            User: senderInfo,
        };

        // Gửi socket cho cả 2 người
        if (req.io) {
            req.io.to(senderId.toString()).emit('new_doctor_message', payload);
            req.io.to(recipientId.toString()).emit('new_doctor_message', payload);
        }

        // Gửi email nếu người nhận offline
        const isRecipientOnline = global.onlineUsers?.has(recipientId);
        const recipient = await User.findByPk(recipientId);

        if (!isRecipientOnline && recipient?.email) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: recipient.email,
                subject: 'Tin nhắn từ hệ thống',
                html: `
                    <p>Bạn có tin nhắn mới từ ${sender.name}</p>
                    <p>Nhấn vào đường dẫn để mở cuộc trò chuyện:</p>
                    <a href="${process.env.FRONTEND_URL}/message/${message.id}">Mở tin nhắn</a>
                `,
            };

            await transporter.sendMail(mailOptions);
        }

        res.status(201).json({ message: 'Message sent', item: newMessageItem });

    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




// 2. Admin lấy tất cả các cuộc trò chuyện không bị ẩn
exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Message.findAll({
            where: { is_hidden_from_admin: false, type: 'admin' },
            include: [{ model: User, as: 'user1', attributes: ['id', 'name', 'email', 'avatar_url'] }],
            order: [['updatedAt', 'DESC']],
            attributes: ['id', 'locked_by', 'updatedAt']

        });
        res.json(messages);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getAllMessagesById = async (req, res) => {
    const userId = req.params.id;
    try {
        const messages = await Message.findAll({
            where: { 
                type: 'doctor',
                [Op.or]: [
                    { user_id: userId},
                    { locked_by: userId },
                ]
            },
            include: [
                { model: User, as: 'user1', attributes: ['id', 'name', 'email', 'avatar_url'] },
                { model: User, as: 'user2', attributes: ['id', 'name', 'email', 'avatar_url'] },
            ],
            order: [['updatedAt', 'DESC']],
            attributes: ['id', 'updatedAt']

        });
        res.json(messages);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.sendAIMessage = async (req, res) => {
    try {
        const senderId = IA_USER_ID;
        const { content } = req.body;
        const recipientId = req.user.id;
        let imageUrl = null;

        if (!recipientId || (!content && !req.file)) {
            return res.status(400).json({ message: 'Missing recipientId or content/image' });
        }

        // Xử lý ảnh nếu có
        if (req.file) {
            const streamUpload = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream({ folder: 'messages' }, (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    });
                    streamifier.createReadStream(req.file.buffer).pipe(stream);
                });
            };
            const result = await streamUpload();
            imageUrl = result.secure_url;
        }

        // Lấy hoặc tạo conversation
        let message = await Message.findOne({ where: { user_id: recipientId, type:'admin' } });

        if (!message) {
            message = await Message.create({ user_id: recipientId, type: 'admin' });
        }

        const newMessageItem = await MessageItem.create({
            message_id: message.id,
            sender_id: senderId,
            content,
            image_url: imageUrl,
        });

        message.update_at = new Date();
        await message.save();

        // Gửi socket nếu có
        if (req.io) {
            req.io.to(recipientId).emit('ai_user_new_message', {
                message_id: message.id,
                sender_id: senderId,
                content,
                image_url: imageUrl,
                createdAt: newMessageItem.createdAt,
                updateAt: newMessageItem.updatedAt,
                User: {
                    id: senderId,
                    name: 'Hệ thống AI',
                    email: 'ia@system.local',
                    avatar_url: 'https://example.com/ai-avatar.png'
                },
            });
            req.io.emit('ai_new_message', {
                message_id: message.id,
                sender_id: null,
                content,
                image_url: imageUrl,
                createdAt: newMessageItem.createdAt,
                updateAt: newMessageItem.updatedAt,
                User: { id: req.user.id, name: req.user.name, email: req.user.email, avatar_url: req.user.avatar_url },
            });
        }

        res.status(201).json({ message: 'AI message sent', item: newMessageItem });
    } catch (error) {
        console.error('AI send message error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// 3. Lấy toàn bộ tin nhắn trong một cuộc trò chuyện
exports.getMessageItems = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Message.findOne({
            where: { user_id: id, type: 'admin' }
        });
        if (!message) return res.json([]);
        const items = await MessageItem.findAll({
            where: { message_id: message.id },
            order: [['createdAt', 'ASC']]
        });
        res.json(items);
    } catch (error) {
        console.error('Get message items error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.checkUsersOnlineStatus = (req, res) => {
    const { userIds } = req.body;
    const status = {};
    const onlineUsers = global.onlineUsers || new Map();

    userIds.forEach(id => {
        status[id] = onlineUsers.has(id.toString());
    });

    res.json({ status });
};


exports.getAdminMessageItems = async (req, res) => {
    try {
        const { id } = req.params;
        const items = await MessageItem.findAll({
            where: { message_id: id },
            include: [{ model: User, attributes: ['id', 'name', 'avatar_url', 'email'] }],
            order: [['createdAt', 'ASC']]
        });
        res.json(items);
    } catch (error) {
        console.error('Get message items error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// 4. Admin ẩn cuộc trò chuyện
exports.hideMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Message.findByPk(id);
        if (!message) return res.status(404).json({ message: 'Message not found' });

        message.is_hidden_from_admin = true;
        await message.save();

        res.json({ message: 'Message hidden from admin' });
    } catch (error) {
        console.error('Hide message error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.unlockMessage = async (req, res) => {
    const messageId = req.params.id;
    const adminId = req.user.id;

    const message = await Message.findByPk(messageId);
    if (!message || message.locked_by !== adminId) {
        return res.status(403).json({ message: 'You do not have permission to unlock this message' });
    }

    message.locked_by = null;
    await message.save();

    // Gửi socket event
    req.io.emit('messageUnlocked', {
        messageId: message.id,
        unlockedBy: adminId,
    });

    res.json({ message: 'Message unlocked' });
};

