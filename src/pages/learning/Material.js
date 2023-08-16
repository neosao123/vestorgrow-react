import { useState, useContext, useEffect } from "react";
import LearningService from "../../services/learningService";
import GlobalContext from "../../context/GlobalContext";
import { useParams, useNavigate, Link } from "react-router-dom";
import moment from "moment";
const serv = new LearningService();
function Material() {
  const params = useParams();
  const navigate = useNavigate();
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [material, setMaterial] = useState();
  useEffect(() => {
    if (user.role.includes("userPaid") || user.role.includes("admin")) {
      getMaterial();
    } else {
      navigate("/learning/locked");
    }
  }, [params.id]);
  const getMaterial = async () => {
    try {
      let resp = await serv.getLearningMaterial(params.id);
      if (resp.data) {
        setMaterial(resp.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handlePdfDownload = async () => {
    try {
      let resp = await serv.getLearningMaterialPdf(params.id);
      if (resp.url) {
        window.open(resp.url, "_blank");
      }
    } catch (err) {
      console.log(err);
    }
  };
  // console.log("lssn", lessonList);
  return (
    <div class="socialContant main_container">
      <div className="learningMaterialSec">
        <div className="learningMaterialClose">
          <Link to={`/learning`} className="learnCloseIcon">
            <img src="/images/icons/close.svg" alt="close" className="img-fluid" />
          </Link>
        </div>
        <div className="learningMaterialHead d-flex justify-content-between">
          <div className="learnMaterialHead">
            <div className="learningMaterialHeading d-flex align-items-center">
              <div className="learningMaterHeading">
                <h4 className="mb-0">{material?.categoryId?.name}</h4>
              </div>
              <div className="learningMaterialTime">
                <h4 className="mb-0">{moment(material?.createdAt).format("MMMM DD")}</h4>
              </div>
            </div>
            <div className="learningMatriHeading">
              <h2 className="mb-0">{material?.title}</h2>
            </div>
          </div>
          <div className="learningMaterialDownload">
            <a href="javascript:void(0);">
              <img src="/images/icons/download.svg" alt="close" onClick={handlePdfDownload} className="img-fluid" />
            </a>
          </div>
        </div>
        <div className="pdfOpenedBanner">
          <img src={material?.cover_image} alt="close" className="img-fluid" />
        </div>
        <div className="pdfContant">
          <p dangerouslySetInnerHTML={{ __html: material?.desc }}></p>
        </div>
        {/* <div className="pdfHeading mt-4 mb-3">
                    <h3>Lorem ipsum dolor sit amet, consectetur</h3>
                </div>
                <div className="pdfContant">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Metus mollis volutpat sed amet. Nisl magna egestas ornare id eget faucibus urna. Magna orci, semper sit arcu arcu a lectus dui arcu. Odio consectetur nullam bibendum adipiscing. A egestas neque orci justo, aliquam tincidunt. Massa viverra duis sit at urna, ut donec arcu. Sit lorem purus urna neque. Lectus diam leo tellus scelerisque. Nulla sed cras arcu pellentesque dolor fusce sollicitudin nec. Neque, justo, vel purus sit velit tincidunt at. Lobortis ut consequat dapibus sollicitudin at nulla netus ullamcorper. Commodo odio interdum hac phasellus enim tempor sed lectus. Purus at ac faucibus sed elementum amet. Etiam gravida habitant interdum eleifend purus, sapien eget.</p>
                </div> */}
      </div>
    </div>
  );
}
export default Material;
