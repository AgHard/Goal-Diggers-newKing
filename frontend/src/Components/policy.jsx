import React, { useContext } from "react";
import { useState } from "react";
import main from "../assets1/course.mp4";
import OwlCarousel from "react-owl-carousel";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import ReactLoading from "react-loading";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import AuthContext, { AuthContextProvider } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Changepassword from "./changepassword";
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Divider,
} from "@mui/material";
import coun_curr_code from "../coun-curr-code";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import "./default-css.css";
import "./font-awesome.min.css";
import "./magnific-popup.css";
import "./owl.carousel.css";
import "./owl.carousel.min.css";
import "./owl.theme.default.css";
import "./owl.theme.default.min.css";
import "./owl.theme.green.css";
import "./owl.theme.green.min.css";
import "./responsive.css";
import "./slicknav.min.css";
import "./styles.css";
import "./templatemo-style2.css";
import "./typography.css";
import "./owl.css";
import "./templatemo-edu-meeting.css";
import "./temp1.css";
function Policy(handleCountry) {
  return (
    <div>
      
        
        <div>
          <h1>Privacy Policy</h1>
          <p>Last updated: December 31, 2022</p>
          <p>
            This Privacy Policy describes Our policies and procedures on the
            collection, use and disclosure of Your information when You use the
            Service and tells You about Your privacy rights and how the law
            protects You.
          </p>
          <p>
            We use Your Personal data to provide and improve the Service. By
            using the Service, You agree to the collection and use of
            information in accordance with this Privacy Policy.
          </p>
          <h1>Interpretation and Definitions</h1>
          <h2>Interpretation</h2>
          <p>
            The words of which the initial letter is capitalized have meanings
            defined under the following conditions. The following definitions
            shall have the same meaning regardless of whether they appear in
            singular or in plural.
          </p>
          <h2>Definitions</h2>
          <p>For the purposes of this Privacy Policy:</p>
          <ul>
            <li>
              <p>
                <strong>Account</strong> means a unique account created for You
                to access our Service or parts of our Service.
              </p>
            </li>
            <li>
              <p>
                <strong>Company</strong> (referred to as either "the Company",
                "We", "Us" or "Our" in this Agreement) refers to Education
                Website, Cairo-NewCairo.
              </p>
            </li>
            <li>
              <p>
                <strong>Cookies</strong> are small files that are placed on Your
                computer, mobile device or any other device by a website,
                containing the details of Your browsing history on that website
                among its many uses.
              </p>
            </li>

            <li>
              <p>
                <strong>Usage Data</strong> refers to data collected
                automatically, either generated by the use of the Service or
                from the Service infrastructure itself (for example, the
                duration of a page visit).
              </p>
            </li>
            <li>
              <p>
                <strong>Website</strong> refers to Candian Chamber of Commercy,
                accessible from{" "}
                <a
                  href="https://www.cancham.org.eg/en/"
                  rel="external nofollow noopener"
                  target="_blank"
                >
                  https://www.cancham.org.eg/en/
                </a>
              </p>
            </li>
            <li>
              <p>
                <strong>You</strong> means the individual accessing or using the
                Service, or the company, or other legal entity on behalf of
                which such individual is accessing or using the Service, as
                applicable.
              </p>
            </li>
          </ul>
          <h1>Collecting and Using Your Personal Data</h1>
          <h2>Types of Data Collected</h2>
          <h3>Personal Data</h3>
          <p>
            While using Our Service, We may ask You to provide Us with certain
            personally identifiable information that can be used to contact or
            identify You. Personally identifiable information may include, but
            is not limited to:
          </p>
          <ul>
            <li>
              <p>Email address</p>
            </li>
            <li>
              <p>First name and last name</p>
            </li>
            <li>
              <p>Usage Data</p>
            </li>
          </ul>
          <h3>Usage Data</h3>
          <p>Usage Data is collected automatically when using the Service.</p>
          <p>
            Usage Data may include information such as Your Device's Internet
            Protocol address (e.g. IP address), browser type, browser version,
            the pages of our Service that You visit, the time and date of Your
            visit, the time spent on those pages, unique device identifiers and
            other diagnostic data.
          </p>
          <p>
            When You access the Service by or through a mobile device, We may
            collect certain information automatically, including, but not
            limited to, the type of mobile device You use, Your mobile device
            unique ID, the IP address of Your mobile device, Your mobile
            operating system, the type of mobile Internet browser You use,
            unique device identifiers and other diagnostic data.
          </p>
          <p>
            We may also collect information that Your browser sends whenever You
            visit our Service or when You access the Service by or through a
            mobile device.
          </p>

          <h2>Retention of Your Personal Data</h2>
          <p>
            The Company will retain Your Personal Data only for as long as is
            necessary for the purposes set out in this Privacy Policy. We will
            retain and use Your Personal Data to the extent necessary to comply
            with our legal obligations (for example, if we are required to
            retain your data to comply with applicable laws), resolve disputes,
            and enforce our legal agreements and policies.
          </p>
          <p>
            The Company will also retain Usage Data for internal analysis
            purposes. Usage Data is generally retained for a shorter period of
            time, except when this data is used to strengthen the security or to
            improve the functionality of Our Service, or We are legally
            obligated to retain this data for longer time periods.
          </p>

          <h1>Contact Us</h1>
          <p>
            If you have any questions about this Privacy Policy, You can contact
            us:
          </p>
          <ul>
            <li>
              <p>By email: info@cancham.org.eg</p>
            </li>
            <li>
              <p>
                By visiting this page on our website:{" "}
                <a
                  href="https://www.cancham.org.eg/en/"
                  rel="external nofollow noopener"
                  target="_blank"
                >
                  https://www.cancham.org.eg/en/
                </a>
              </p>
            </li>
            <li>
              <p>By phone number: +201001004070</p>
            </li>
          </ul>
        </div>
      </div>

  );
}

export default Policy;
