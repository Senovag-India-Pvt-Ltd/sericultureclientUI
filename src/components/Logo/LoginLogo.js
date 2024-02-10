import { Link } from "react-router-dom";
import { Media, MediaGroup, Image, OverlineTitle } from "..";

function LoginLogo() {
  return (
    <Link to="/seriui/" className="logo-link">
      <div className="logo-wrap">
        <div className="d-flex justify-content-center">
          <img
            src="../images/logo/KG.png"
            alt="Government of Karnataka"
            style={{ height: 200, width: 200 }}
          />
          {/* <Image
            src="images/logo/7croreLogo.png"
          /> */}
        </div>
        {/* <div className="d-flex justify-content-center" style={{fontWeight:"bold", fontSize:"25px"}}>
                <span>M-</span><span style={{color:'red'}}>2&nbsp;</span><span style={{color:'#bdbb0d'}}>Group</span>
            </div> */}
        {/* <svg className="logo-svg" width="154" height="35" viewBox="0 0 154 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g className="logo-text">
                    <path d="M41.6332 34V27.52H44.3692C44.4322 27.52 44.5162 27.523 44.6212 27.529C44.7292 27.532 44.8252 27.541 44.9092 27.556C45.2962 27.616 45.6127 27.7435 45.8587 27.9385C46.1077 28.1335 46.2907 28.3795 46.4077 28.6765C46.5247 28.9705 46.5832 29.299 46.5832 29.662C46.5832 30.205 46.4482 30.67 46.1782 31.057C45.9082 31.441 45.4852 31.678 44.9092 31.768L44.3692 31.804H42.8572V34H41.6332ZM45.2872 34L44.0092 31.363L45.2692 31.12L46.6732 34H45.2872ZM42.8572 30.661H44.3152C44.3782 30.661 44.4472 30.658 44.5222 30.652C44.5972 30.646 44.6662 30.634 44.7292 30.616C44.8942 30.571 45.0217 30.496 45.1117 30.391C45.2017 30.283 45.2632 30.1645 45.2962 30.0355C45.3322 29.9035 45.3502 29.779 45.3502 29.662C45.3502 29.545 45.3322 29.422 45.2962 29.293C45.2632 29.161 45.2017 29.0425 45.1117 28.9375C45.0217 28.8295 44.8942 28.753 44.7292 28.708C44.6662 28.69 44.5972 28.678 44.5222 28.672C44.4472 28.666 44.3782 28.663 44.3152 28.663H42.8572V30.661ZM49.2825 34V27.52H53.5125V28.663H50.5065V30.049H52.9725V31.192H50.5065V32.857H53.5125V34H49.2825ZM55.7611 34L57.7411 27.52H59.5681L61.5481 34H60.2881L58.5241 28.285H58.7581L57.0211 34H55.7611ZM56.9491 32.65V31.507H60.3691V32.65H56.9491ZM66.5798 34.135C65.9318 34.135 65.3723 33.994 64.9013 33.712C64.4333 33.43 64.0718 33.0355 63.8168 32.5285C63.5648 32.0215 63.4388 31.432 63.4388 30.76C63.4388 30.088 63.5648 29.4985 63.8168 28.9915C64.0718 28.4845 64.4333 28.09 64.9013 27.808C65.3723 27.526 65.9318 27.385 66.5798 27.385C67.3238 27.385 67.9478 27.5695 68.4518 27.9385C68.9588 28.3075 69.3158 28.807 69.5228 29.437L68.2898 29.779C68.1698 29.386 67.9673 29.0815 67.6823 28.8655C67.3973 28.6465 67.0298 28.537 66.5798 28.537C66.1688 28.537 65.8253 28.6285 65.5493 28.8115C65.2763 28.9945 65.0708 29.2525 64.9328 29.5855C64.7948 29.9185 64.7258 30.31 64.7258 30.76C64.7258 31.21 64.7948 31.6015 64.9328 31.9345C65.0708 32.2675 65.2763 32.5255 65.5493 32.7085C65.8253 32.8915 66.1688 32.983 66.5798 32.983C67.0298 32.983 67.3973 32.8735 67.6823 32.6545C67.9673 32.4355 68.1698 32.131 68.2898 31.741L69.5228 32.083C69.3158 32.713 68.9588 33.2125 68.4518 33.5815C67.9478 33.9505 67.3238 34.135 66.5798 34.135ZM73.6367 34V28.663H71.5937V27.52H76.9037V28.663H74.8607V34H73.6367Z" fill="#5C46FA"/>
                    <path d="M81 31H97" stroke="#18C5EC"/>
                    <path d="M40.68 22.9761V5.69607H43.992L51.504 17.2161V5.69607H54.816V22.9761H51.504L43.992 11.4561V22.9761H40.68ZM57.5644 22.9761V5.69607H60.8284V22.9761H57.5644ZM71.0019 23.3361C69.2739 23.3361 67.7819 22.9601 66.5259 22.2081C65.2779 21.4561 64.3139 20.4041 63.6339 19.0521C62.9619 17.7001 62.6259 16.1281 62.6259 14.3361C62.6259 12.5441 62.9619 10.9721 63.6339 9.62007C64.3139 8.26807 65.2779 7.21607 66.5259 6.46407C67.7819 5.71207 69.2739 5.33607 71.0019 5.33607C72.7299 5.33607 74.2179 5.71207 75.4659 6.46407C76.7219 7.21607 77.6859 8.26807 78.3579 9.62007C79.0379 10.9721 79.3779 12.5441 79.3779 14.3361C79.3779 16.1281 79.0379 17.7001 78.3579 19.0521C77.6859 20.4041 76.7219 21.4561 75.4659 22.2081C74.2179 22.9601 72.7299 23.3361 71.0019 23.3361ZM71.0019 20.2641C72.0979 20.2801 73.0099 20.0441 73.7379 19.5561C74.4659 19.0681 75.0099 18.3761 75.3699 17.4801C75.7379 16.5841 75.9219 15.5361 75.9219 14.3361C75.9219 13.1361 75.7379 12.0961 75.3699 11.2161C75.0099 10.3361 74.4659 9.65207 73.7379 9.16407C73.0099 8.67607 72.0979 8.42407 71.0019 8.40807C69.9059 8.39207 68.9939 8.62807 68.2659 9.11607C67.5379 9.60407 66.9899 10.2961 66.6219 11.1921C66.2619 12.0881 66.0819 13.1361 66.0819 14.3361C66.0819 15.5361 66.2619 16.5761 66.6219 17.4561C66.9899 18.3361 67.5379 19.0201 68.2659 19.5081C68.9939 19.9961 69.9059 20.2481 71.0019 20.2641ZM80.9334 22.9761V5.69607H87.6054C88.5734 5.69607 89.4174 5.89607 90.1374 6.29607C90.8574 6.69607 91.4174 7.23607 91.8174 7.91607C92.2174 8.58807 92.4174 9.33207 92.4174 10.1481C92.4174 11.0761 92.1694 11.9041 91.6734 12.6321C91.1774 13.3521 90.5134 13.8521 89.6814 14.1321L89.6574 13.5441C90.7774 13.8641 91.6574 14.4241 92.2974 15.2241C92.9374 16.0241 93.2574 16.9921 93.2574 18.1281C93.2574 19.1281 93.0454 19.9921 92.6214 20.7201C92.1974 21.4401 91.6014 21.9961 90.8334 22.3881C90.0654 22.7801 89.1734 22.9761 88.1574 22.9761H80.9334ZM82.7094 21.2841H87.7254C88.4294 21.2841 89.0614 21.1601 89.6214 20.9121C90.1814 20.6561 90.6214 20.2961 90.9414 19.8321C91.2694 19.3681 91.4334 18.8081 91.4334 18.1521C91.4334 17.5121 91.2854 16.9361 90.9894 16.4241C90.6934 15.9121 90.2894 15.5041 89.7774 15.2001C89.2734 14.8881 88.6974 14.7321 88.0494 14.7321H82.7094V21.2841ZM82.7094 13.0641H87.5934C88.1454 13.0641 88.6494 12.9401 89.1054 12.6921C89.5614 12.4361 89.9214 12.0881 90.1854 11.6481C90.4574 11.2081 90.5934 10.7001 90.5934 10.1241C90.5934 9.30807 90.3094 8.64407 89.7414 8.13207C89.1814 7.62007 88.4654 7.36407 87.5934 7.36407H82.7094V13.0641ZM101.808 23.3361C100.088 23.3361 98.6362 22.9561 97.4522 22.1961C96.2682 21.4281 95.3722 20.3681 94.7642 19.0161C94.1562 17.6641 93.8522 16.1041 93.8522 14.3361C93.8522 12.5681 94.1562 11.0081 94.7642 9.65607C95.3722 8.30407 96.2682 7.24807 97.4522 6.48807C98.6362 5.72007 100.088 5.33607 101.808 5.33607C103.536 5.33607 104.988 5.72007 106.164 6.48807C107.348 7.24807 108.244 8.30407 108.852 9.65607C109.468 11.0081 109.776 12.5681 109.776 14.3361C109.776 16.1041 109.468 17.6641 108.852 19.0161C108.244 20.3681 107.348 21.4281 106.164 22.1961C104.988 22.9561 103.536 23.3361 101.808 23.3361ZM101.808 21.6441C103.16 21.6441 104.288 21.3361 105.192 20.7201C106.096 20.1041 106.772 19.2481 107.22 18.1521C107.676 17.0481 107.904 15.7761 107.904 14.3361C107.904 12.8961 107.676 11.6281 107.22 10.5321C106.772 9.43607 106.096 8.58007 105.192 7.96407C104.288 7.34807 103.16 7.03607 101.808 7.02807C100.456 7.02807 99.3322 7.33607 98.4362 7.95207C97.5402 8.56807 96.8642 9.42807 96.4082 10.5321C95.9602 11.6281 95.7322 12.8961 95.7242 14.3361C95.7162 15.7761 95.9362 17.0441 96.3842 18.1401C96.8402 19.2281 97.5202 20.0841 98.4242 20.7081C99.3282 21.3241 100.456 21.6361 101.808 21.6441ZM109.671 22.9761L115.623 5.69607H117.963L123.915 22.9761H122.079L116.427 6.68007H117.123L111.507 22.9761H109.671ZM112.323 18.7881V17.1321H121.251V18.7881H112.323ZM125.242 22.9761V5.69607H131.914C132.082 5.69607 132.27 5.70407 132.478 5.72007C132.694 5.72807 132.91 5.75207 133.126 5.79207C134.03 5.92807 134.794 6.24407 135.418 6.74007C136.05 7.22807 136.526 7.84407 136.846 8.58807C137.174 9.33207 137.338 10.1561 137.338 11.0601C137.338 12.3641 136.994 13.4961 136.306 14.4561C135.618 15.4161 134.634 16.0201 133.354 16.2681L132.742 16.4121H127.006V22.9761H125.242ZM135.706 22.9761L132.298 15.9441L133.99 15.2961L137.734 22.9761H135.706ZM127.006 14.7321H131.866C132.01 14.7321 132.178 14.7241 132.37 14.7081C132.562 14.6921 132.75 14.6641 132.934 14.6241C133.526 14.4961 134.01 14.2521 134.386 13.8921C134.77 13.5321 135.054 13.1041 135.238 12.6081C135.43 12.1121 135.526 11.5961 135.526 11.0601C135.526 10.5241 135.43 10.0081 135.238 9.51207C135.054 9.00807 134.77 8.57607 134.386 8.21607C134.01 7.85607 133.526 7.61207 132.934 7.48407C132.75 7.44407 132.562 7.42007 132.37 7.41207C132.178 7.39607 132.01 7.38807 131.866 7.38807H127.006V14.7321ZM139.542 22.9761V5.69607H144.786C144.97 5.69607 145.282 5.70007 145.722 5.70807C146.17 5.71607 146.598 5.74807 147.006 5.80407C148.318 5.98807 149.414 6.47607 150.294 7.26807C151.174 8.06007 151.834 9.06807 152.274 10.2921C152.714 11.5161 152.934 12.8641 152.934 14.3361C152.934 15.8081 152.714 17.1561 152.274 18.3801C151.834 19.6041 151.174 20.6121 150.294 21.4041C149.414 22.1961 148.318 22.6841 147.006 22.8681C146.606 22.9161 146.178 22.9481 145.722 22.9641C145.266 22.9721 144.954 22.9761 144.786 22.9761H139.542ZM141.366 21.2841H144.786C145.114 21.2841 145.466 21.2761 145.842 21.2601C146.226 21.2361 146.554 21.1961 146.826 21.1401C147.834 20.9641 148.646 20.5561 149.262 19.9161C149.886 19.2761 150.342 18.4761 150.63 17.5161C150.918 16.5481 151.062 15.4881 151.062 14.3361C151.062 13.1761 150.918 12.1121 150.63 11.1441C150.342 10.1761 149.886 9.37607 149.262 8.74407C148.638 8.11207 147.826 7.70807 146.826 7.53207C146.554 7.47607 146.222 7.44007 145.83 7.42407C145.446 7.40007 145.098 7.38807 144.786 7.38807H141.366V21.2841Z" fill="currentColor"/>
                </g>
                <g className="logo-monogram">
                    <path d="M8.95187 8.1834C9.04813 7.89486 9.30481 7.7025 9.59358 7.7025H14.5027C16.0107 7.7025 17.3262 8.79255 17.5829 10.2994L19.0909 18.571L22.1711 8.1834C22.2353 7.99104 22.8128 5.74682 23.2299 4.43234L15.9786 0.264498C15.369 -0.0881659 14.631 -0.0881659 14.0214 0.264498L0.994652 7.76662C0.385027 8.11928 0 8.76049 0 9.46582V24.5021C0 25.2075 0.385027 25.8487 0.994652 26.2013L2.56684 27.1311L8.95187 8.1834Z" fill="url(#paint0_linear_4445_18035)"/>
                    <path d="M29.0373 7.76643L27.5934 6.93286L22.3314 25.7523C22.2351 26.0408 21.9785 26.2332 21.6897 26.2332L16.0747 26.2652C15.7539 26.2652 15.4651 26.0408 15.4009 25.7202L12.9303 13.4411L7.18701 29.7919L14.0212 33.7353C14.6309 34.088 15.3688 34.088 15.9785 33.7353L29.0052 26.2011C29.6148 25.8485 29.9998 25.2073 29.9998 24.5019V9.46563C29.9998 8.7603 29.6469 8.11909 29.0373 7.76643Z" fill="url(#paint1_linear_4445_18035)"/>
                </g>
                <defs>
                    <linearGradient id="paint0_linear_4445_18035" x1="11.615" y1="-2.58227e-08" x2="2.49215" y2="29.5115" gradientUnits="userSpaceOnUse">
                        <stop stop-color="var(--logo-sym-secondary-2,#17C5EB)"/>
                        <stop offset="1" stop-color="var(--logo-sym-secondary-1,#0080FF)"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_4445_18035" x1="26" y1="-2.50127" x2="14.4905" y2="28.0095" gradientUnits="userSpaceOnUse">
                        <stop stop-color="var(--logo-sym-accent-2,#478FFC)"/>
                        <stop offset="1" stop-color="var(--logo-sym-accent-1,#5F38F9)"/>
                    </linearGradient>
                </defs>
            </svg> */}
      </div>
    </Link>
  );
}

export default LoginLogo;
