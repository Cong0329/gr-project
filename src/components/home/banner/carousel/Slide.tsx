import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Slide.css';

interface SlideProps {
  image: string;
}

const images: SlideProps[] = [
  {
    image: 'https://i.imgur.com/WLDASTO.png',
  },
  {
    image: 'https://i.imgur.com/bAGysSi.png',
  },
  {
    image: 'https://i.imgur.com/1PFCxUX.png',
  },
  {
    image: 'https://i.imgur.com/hoWTJoH.png',
  },

]

export const Slide = () => {
  return (
    <div className='w-8/12 h-full'>
      <Carousel 
        showThumbs={false} 
        infiniteLoop={true} 
        autoPlay={true} 
        animationHandler={'slide'} 
        interval={3000} 
        showStatus={false} 
        stopOnHover={true}
        className="w-full h-full relative"
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="absolute mr-2 right-0 top-1/2 transform -translate-y-1/2 bg-blue-800 bg-opacity-40 p-2 rounded-full text-white h-8 w-8 flex items-center justify-center"
            >
              <span className="sr-only">Next</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )
        }
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="absolute z-10 ml-2 left-0 top-1/2 transform -translate-y-1/2 bg-blue-800 bg-opacity-40 p-2 rounded-full text-white h-8 w-8 flex items-center justify-center"
            >
              <span className="sr-only">Previous</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )
        }
      >
        {images.map((image, index) => (
          <div key={index} className="w-full h-full">
            <img src={image.image} alt='' loading='lazy' className="w-full h-full object-cover rounded-2xl" />
          </div>
        ))}
      </Carousel>
    </div>
  )
}
