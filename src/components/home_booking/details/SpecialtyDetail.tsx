import Breadcrumb from "./component_details/BreadCrumb";

const SpecialtyDetail = () => {

    return(
        <>
        <div id="specialty-detail" className="w-full">
          <div className="specialty container-fix-spe mx-auto">
            <div className="specialty-content">
              <div className="specialty-title text-center items-center">
                  <h3 className="text-xl font-bold mb-4">
                    Khám chuyên khoa
                  </h3>
              </div>
  
              <div className="specialty-body">
                <Breadcrumb />
              </div>
            </div>
          </div>
        </div>
      </>
    )
}

export default SpecialtyDetail;