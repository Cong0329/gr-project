import logo from '../../assets/logo.png';
import { Search } from './Search';
import { Login } from './Login';
import { Cart } from './Cart';
import './Navbar.css';
import { Link } from 'react-router-dom';



export const Navbar = () => {

  const popularSearches: Array<{ id: number; name: string }> = [
    { id: 1, name: 'Canxi' },
    { id: 2, name: 'Sữa rửa mặt' },
    { id: 3, name: 'DHA' },
    { id: 4, name: 'Kem chống nắng' },
    { id: 5, name: 'Dhc' },
    { id: 6, name: 'Thuốc nhỏ mắt' },
  ];

  return (
    <nav className="text-white pb-5 ">
      <div className="container mx-auto flex justify-between items-center w-4/5 ">
        <div className='flex'>
          <Link to="/" className='flex items-center hover:text-white'>
            <img src={logo} alt="logo" className='w-14 h-14' />
            <div className='m-auto ml-2'>
              <h1 className='text-2xl font-bold'>Health Pharmacy</h1>
              <p className='text-sm'>Your Health, Our Priority</p>
            </div>
          </Link>
        </div>
        <div className='w-1/2 mt-10'>
          <div className='w-full h-12 flex'>
            <Search />
          </div>
          <div className='flex flex-wrap justify-center mt-2'>
            {popularSearches.map((item: { id: number; name: string }) => (
              <button key={item.id} className='bg-blue-200 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2'>
                {item.name}
              </button>
            ))}
          </div>
        </div>
        <div className='flex space-x-10'>
          <Login />
          <Cart />
        </div>
      </div>
    </nav>
  )
}
