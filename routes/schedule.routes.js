const express = require('express');
const router = express.Router();
const { Schedule, Doctor, Department } = require("../models");

// GET /api/v1/schedule - Main route for fetching schedules
router.get("/", async (req, res) => {
    try {
      const where = {};
      
      // Allow filtering by type, but don't force specialist type
      if (req.query.type) {
        where.type = req.query.type;
      }
      
      if (req.query.doctor_id) {
        where.doctor_id = req.query.doctor_id;
      }
      
      // Include Doctor and Department
      const schedules = await Schedule.findAll({ 
        where,
        include: [
          {
            model: Doctor,
            as: 'doctor',
            include: [
              {
                model: Department,
                as: 'department'
              }
            ]
          }
        ]
      });
  
      // Format data for frontend
      const formattedSchedules = schedules.map(schedule => {
        const plainSchedule = schedule.get({ plain: true });
        const type = plainSchedule.type;
        
        // Formatting based on type
        return {
          ...plainSchedule,
          department: plainSchedule.doctor?.department,
          ...(type === 'specialist' ? {
            specialist_pkg: plainSchedule.doctor?.department,
            serviceInfo: plainSchedule.doctor?.department
          } : {
            // Add appropriate fields for general type too
            serviceInfo: plainSchedule.doctor?.department
          })
        };
      });
      
      res.json(formattedSchedules);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      res.status(500).json({ error: error.message });
    }
  });

// GET /api/v1/schedule/general - Route for general schedules
router.get("/general", async (req, res) => {
    try {
      const schedules = await Schedule.findAll({
        where: { type: 'general' },
        include: [
          {
            model: Doctor,
            as: 'doctor',
            include: [
              {
                model: Department,
                as: 'department'
              }
            ]
          }
        ]
      });
      
      // Format data
      const formattedSchedules = schedules.map(schedule => {
        const plainSchedule = schedule.get({ plain: true });
        return {
          ...plainSchedule,
          department: plainSchedule.doctor?.department,
          serviceInfo: plainSchedule.doctor?.department
        };
      });
      
      res.json(formattedSchedules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.get("/medical", async (req, res) => {
  res.status(501).json({ 
    message: "Medical package functionality is temporarily disabled",
    suggestion: "Please use the specialist route instead"
  });
});

// GET /api/v1/schedule/specialist - Keep this route for specialist schedules
router.get("/specialist", async (req, res) => {
  try {
    const schedules = await Schedule.findAll({
      where: { type: 'specialist' },
      include: [
        {
          model: Doctor,
          as: 'doctor',
          include: [
            {
              model: Department,
              as: 'department'
            }
          ]
        }
      ]
    });
    
    // Format data
    const formattedSchedules = schedules.map(schedule => {
      const plainSchedule = schedule.get({ plain: true });
      return {
        ...plainSchedule,
        specialist_pkg: plainSchedule.doctor?.department,
        department: plainSchedule.doctor?.department,
        serviceInfo: plainSchedule.doctor?.department
      };
    });
    
    res.json(formattedSchedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/schedule/:doctor_id - Get schedule by doctor
router.get("/:doctor_id", async (req, res) => {
    try {
      const where = { 
        doctor_id: req.params.doctor_id
      };
      
      // Only filter by type if provided
      if (req.query.type) {
        where.type = req.query.type;
      }
      
      const schedules = await Schedule.findAll({ 
        where,
        include: [
          {
            model: Doctor,
            as: 'doctor',
            include: [
              {
                model: Department,
                as: 'department'
              }
            ]
          }
        ]
      });
      
      if (schedules.length === 0) {
        return res.status(404).json({ message: "No schedule found for this doctor" });
      }
      
      // Format data
      const formattedSchedules = schedules.map(schedule => {
        const plainSchedule = schedule.get({ plain: true });
        const type = plainSchedule.type;
        
        return {
          ...plainSchedule,
          department: plainSchedule.doctor?.department,
          ...(type === 'specialist' ? {
            specialist_pkg: plainSchedule.doctor?.department,
            serviceInfo: plainSchedule.doctor?.department
          } : {
            serviceInfo: plainSchedule.doctor?.department
          })
        };
      });
      
      res.json(formattedSchedules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// POST /api/v1/schedule - Create new schedule (modified for specialist focus)
router.post("/", async (req, res) => {
  try {
    const { doctor_id, date, start_time, end_time, status, type, service_id } = req.body;
    
    // For now, we'll focus only on specialist type
    if (type !== 'specialist') {
      return res.status(400).json({ 
        error: "Only specialist type is currently supported",
        suggestion: "Please set type to 'specialist'"
      });
    }
    
    if (!service_id) {
      return res.status(400).json({ error: "service_id is required" });
    }
    
    const newSchedule = await Schedule.create({
      doctor_id,
      date,
      start_time,
      end_time,
      status: status || 'available',
      type: 'specialist',
      service_id
    });
    
    // Get complete information with relations
    const completeSchedule = await Schedule.findByPk(newSchedule.id, {
      include: [
        {
          model: Doctor,
          as: 'doctor',
          include: [
            {
              model: Department,
              as: 'department'
            }
          ]
        }
      ]
    });
    
    // Format response for specialist
    const plainSchedule = completeSchedule.get({ plain: true });
    const responseData = {
      ...plainSchedule,
      specialist_pkg: plainSchedule.doctor?.department,
      department: plainSchedule.doctor?.department,
      serviceInfo: plainSchedule.doctor?.department
    };
    
    res.status(201).json(responseData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/v1/schedule/:id - Update schedule
router.put("/:id", async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    // For now, only allow specialist type
    if (req.body.type && req.body.type !== 'specialist') {
      return res.status(400).json({ 
        error: "Only specialist type is currently supported",
        suggestion: "Please keep type as 'specialist'"
      });
    }

    const updatedSchedule = await schedule.update(req.body);
    
    // Get data with relations
    const completeSchedule = await Schedule.findByPk(updatedSchedule.id, {
      include: [
        {
          model: Doctor,
          as: 'doctor',
          include: [
            {
              model: Department,
              as: 'department'
            }
          ]
        }
      ]
    });
    
    // Format response for specialist
    const plainSchedule = completeSchedule.get({ plain: true });
    const responseData = {
      ...plainSchedule,
      specialist_pkg: plainSchedule.doctor?.department,
      department: plainSchedule.doctor?.department,
      serviceInfo: plainSchedule.doctor?.department
    };
    
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/v1/schedule/:id - Delete schedule
router.delete("/:id", async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });

    await schedule.destroy(); 
    res.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Keep the appointments endpoints as they don't directly reference the missing models
// POST /api/v1/schedule/appointments - Create new appointment
router.post("/appointments", async (req, res) => {
  try {
    // Assuming you have an Appointment model
    const { Appointment } = require("../models");
    const appointmentData = req.body;
    
    const newAppointment = await Appointment.create(appointmentData);
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/v1/schedule/appointments/:id - Update appointment status
router.patch("/appointments/:id", async (req, res) => {
  try {
    const { Appointment } = require("../models");
    const appointment = await Appointment.findByPk(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    
    const updatedAppointment = await appointment.update(req.body);
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/schedule/schedules - Create schedule from confirmed appointment
router.post("/schedules", async (req, res) => {
  try {
    // For now, only allow specialist type
    if (req.body.type && req.body.type !== 'specialist') {
      return res.status(400).json({ 
        error: "Only specialist type is currently supported",
        suggestion: "Please set type to 'specialist'"
      });
    }
    
    const scheduleData = {
      ...req.body,
      type: 'specialist'  // Force specialist type
    };
    
    const newSchedule = await Schedule.create(scheduleData);
    
    // Get complete information with relations
    const completeSchedule = await Schedule.findByPk(newSchedule.id, {
      include: [
        {
          model: Doctor,
          as: 'doctor',
          include: [
            {
              model: Department,
              as: 'department'
            }
          ]
        }
      ]
    });
    
    // Format response for specialist
    const plainSchedule = completeSchedule.get({ plain: true });
    const responseData = {
      ...plainSchedule,
      specialist_pkg: plainSchedule.doctor?.department,
      department: plainSchedule.doctor?.department,
      serviceInfo: plainSchedule.doctor?.department
    };
    
    res.status(201).json(responseData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;