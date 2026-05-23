import React from "react";
import { useTranslation } from "react-i18next";

function Footer() {
  const { i18n } = useTranslation();
  const isKannada = i18n.resolvedLanguage === "kn";

  const departmentText = isKannada
    ? "ರೇಷ್ಮೆ ಇಲಾಖೆ, ಕರ್ನಾಟಕ ಸರ್ಕಾರ"
    : "Department of Sericulture, Government of Karnataka";
  const developerText = isKannada
    ? "ಸೆನೋವಾಗ್ ಇಂಡಿಯಾ ಪ್ರೈ. ಲಿ. ಅವರಿಂದ ವಿನ್ಯಾಸ ಮತ್ತು ಅಭಿವೃದ್ಧಿಪಡಿಸಲಾಗಿದೆ"
    : "Designed and Developed by Senovag India Pvt. Ltd.";

  return (
    <div className="nk-footer" style={{backgroundColor: "#0f6cbe",color: "#fff"}}>
      <div className="container-fluid">
        <div className="nk-footer-wrap d-flex justify-content-center">
          <div className="nk-footer-copyright">
            &copy; {departmentText}
            <span className="mx-2" style={{ opacity: 0.5 }}>|</span>
            {developerText}
          </div>
          <div className="nk-footer-links">
            {/* <Nav as="ul" className="nav-sm">
              <Nav.Item as="li">
                <Nav.Link href="#link">About</Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link href="#link">Support</Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link href="#link">Blog</Nav.Link>
              </Nav.Item>
            </Nav> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
