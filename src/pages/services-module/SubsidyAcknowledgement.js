import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import Layout from "../../layout/default";
import Block from "../../components/Block/Block";
import StakeHolderData from "../../store/stakeHolder/StakeHolderData";

function StakeHolderViewPage() {
  //   const { id } = useParams();
  const id = "uid01";
  const [data] = useState(StakeHolderData);
  const [StakeHolder, setStakeHolder] = useState(data[0]);

  // grabs the id form the url and loads the corresponding data
  useEffect(() => {
    let findUser = data.find((item) => item.id === id);
    setStakeHolder(findUser);
  }, [id, data]);

  return (
    <Layout title="Stake Holder View" content="container">
      <Block.Head>
        <Block.HeadBetween>
          <Block.HeadContent>
            <Block.Title tag="h2">Subsidy Form Acknowledgement</Block.Title>
            <nav>
              <ol className="breadcrumb breadcrumb-arrow mb-0">
                <li className="breadcrumb-item">
                  <Link to="/seriui/">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Subsidy Form Acknowledgement
                </li>
              </ol>
            </nav>
          </Block.HeadContent>
          {/* <Block.HeadContent>
            <ul className="d-flex">
              <li>
                <Link
                  to="/seriui/stake-holder-list"
                  className="btn btn-primary btn-md d-md-none"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/seriui/stake-holder-list"
                  className="btn btn-primary d-none d-md-inline-flex"
                >
                  <Icon name="arrow-long-left" />
                  <span>Go to List</span>
                </Link>
              </li>
            </ul>
          </Block.HeadContent> */}
        </Block.HeadBetween>
      </Block.Head>

      <Block className="mt-4">
        <Card>
          <Card.Body>
            <div className="bio-block">
              <h4 className="bio-block-title">Acknowledgement Reciept</h4>{" "}
              <br></br>
              <h5 style={{ textAlign: "center" }}>
                ಸೀಕೃತಿ ಪತ್ರದ ದಿನಾಂಕ : ೧೯-೦೯-೨೦೨೩
              </h5>
              <p>
                ೨೦೨೨-೨೩ ನೇ ಸಾಲಿನಲ್ಲಿ Sericulture Development Programme
                2851-00-107-1-35 ಅಡಿಯಲ್ಲಿ ವಿಜಯ ನಗರ ಜಿಲ್ಲೆ ಹೊಸಪೇಟೆ ತಾಲ್ಲೂಕು
                ಹೊಸಪೇಟೆ ಹೋಬಳಿ ನರಸಾಪುರ ಹಳ್ಳಿಯ ನಿವಾಸಿಯಾದ ಶ್ರೀಮತಿ Renukamma ರವರಿಂದ
                Subsidy for Mulberry garden implements ಯಂತ್ರೋಪಕರಣಕ್ಕೆ ಸಹಾಯ ಧನ
                ಪಡೆಯಲು ಅರ್ಜಿಯನ್ನು ಸಲ್ಲಿಸಿರುತ್ತಾರೆ. ಇವರ ನೋಂದಣಿಯ ಸಂಖ್ಯೆಯು :
                FID31010000210 ಆಗಿರುತ್ತದೆ. ಈ ನೋಂದಣಿಯ ಸಂಖ್ಯೆಯನ್ನು ಮುಂದಿನ
                ವಿಚಾರಣೆಗೆ ಉಪಯೋಗಿಸತಕ್ಕದ್ದು.{" "}
              </p>
            </div>
            <div className="gap-col mt-4">
              <ul className="d-flex align-items-center justify-content-center gap g-3">
                <li>
                  <li>
                    <Button
                      href="../pdf/WorkOrder_Format.pdf"
                      type="button"
                      target="_blank"
                      variant="secondary"
                    >
                      Print
                    </Button>
                  </li>
                </li>
              </ul>
            </div>
          </Card.Body>
        </Card>
      </Block>
    </Layout>
  );
}

export default StakeHolderViewPage;
