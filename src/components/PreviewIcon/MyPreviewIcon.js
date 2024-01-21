import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";

import Icon from "../Icon/Icon";

function MyPreviewIconList({ ...props }) {
  return <ul className="preview-icon-list">{props.children}</ul>;
}

function MyPreviewIcon({ title, icon, link, menu, ...props }) {
  const navigate = useNavigate();

  const clickIcon = () => {
    localStorage.setItem("sidemenu", menu);
    navigate(link);
  };

  return (
    <li className="preview-icon-item">
      {/* <Link to={link}> */}
      <Card className="h-100 preview-icon-box" onClick={clickIcon}>
        <button
          type="button"
          className="btn btn-icon btn-clipboard js-copy text-light"
        ></button>
        <div className="preview-icon-wrap">
          <Icon name={icon}></Icon>
        </div>
        <span className="preview-icon-name">{title}</span>
      </Card>
      {/* </Link> */}
    </li>
  );
}

MyPreviewIcon.List = MyPreviewIconList;

export default MyPreviewIcon;
