import { Body } from "../home/Body"
import { Footer } from "../footer/Footer"
import { Header } from "../header/Header"


export const Home = () => {
    return (
        <div className="flex flex-col min-h-screen bg-red-500">
            <Header />
            <Body />
            <Footer />
        </div>
    )
}
