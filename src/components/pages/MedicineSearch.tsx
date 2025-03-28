import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import { SearchBody } from "../medicine_search/SearchBody";

export const SearchPage = () => {
  return (
     <div className="flex flex-col min-h-screen">
                <Header />
                <SearchBody />
                <Footer />
            </div>
  );
};


