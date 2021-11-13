const nodemailer = require("nodemailer");
const CryptoJS = require("crypto-js");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Register
// router.post("/register", async (req, res) => {
//   const newUser = new User({
//     username: req.body.username,
//     email: req.body.email,
//     password: CryptoJS.AES.encrypt(req.body.password, process.env.CRYPTO_SEC).toString(),
//   });

//   try {
//     const savedUser = await newUser.save();

//     res.status(201).json(savedUser);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

exports.signup = async (req, res) => {
  const { email, username, password } = req.body;
  // Check we have an email

  if (!email) {
    return res.status(422).json("Molimo vas da unesete email");
  }
  try {
    // Check if the email is in use
    const existingEmail = await User.findOne({ email }).exec();
    if (existingEmail) {
      return res.status(409).json("Email adresa je u upotrebi!");
    }
    const existingUser = await User.findOne({ username }).exec();
    if (existingUser) {
      return res.status(409).json("Korisnicko ime je zauzeto!");
    }
    // Step 1 - Create and save the user
    const user = await new User({
      username: username,
      email: email,
      password: CryptoJS.AES.encrypt(password, process.env.CRYPTO_SEC).toString(),
    }).save();
    // Step 2 - Generate a verification token with the user's ID
    const verificationToken = user.generateVerificationToken();
    // Step 3 - Email the user a unique verification link
    const url = `${process.env.BASE_URL}auth/verify/${verificationToken}`;
    transporter.sendMail({
      to: email,
      subject: "Verify Account / Verifikujte nalog",
      html: `<html>
      <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <style type="text/css">
          @media screen {
            @font-face {
              font-family: "Lato";
              font-style: normal;
              font-weight: 400;
              src: local("Lato Regular"), local("Lato-Regular"), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format("woff");
            }
    
            @font-face {
              font-family: "Lato";
              font-style: normal;
              font-weight: 700;
              src: local("Lato Bold"), local("Lato-Bold"), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format("woff");
            }
    
            @font-face {
              font-family: "Lato";
              font-style: italic;
              font-weight: 400;
              src: local("Lato Italic"), local("Lato-Italic"), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format("woff");
            }
    
            @font-face {
              font-family: "Lato";
              font-style: italic;
              font-weight: 700;
              src: local("Lato Bold Italic"), local("Lato-BoldItalic"), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format("woff");
            }
          }
    
          /* CLIENT-SPECIFIC STYLES */
          body,
          table,
          td,
          a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
    
          table,
          td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
          }
    
          img {
            -ms-interpolation-mode: bicubic;
          }
    
          /* RESET STYLES */
          img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
          }
    
          table {
            border-collapse: collapse !important;
          }
    
          body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }
    
          /* iOS BLUE LINKS */
          a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
          }
    
          /* MOBILE STYLES */
          @media screen and (max-width: 600px) {
            h1 {
              font-size: 32px !important;
              line-height: 32px !important;
            }
          }
    
          /* ANDROID CENTER FIX */
          div[style*="margin: 16px 0;"] {
            margin: 0 !important;
          }
        </style>
      </head>
    
      <body style="background-color: #a9a9a9; margin: 0 !important; padding: 0 !important">
        <!-- HIDDEN PREHEADER TEXT -->
        <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden">
          Dobrodošli na našu webshop aplikaciju!
        </div>
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <!-- LOGO -->
          <tr>
            <td bgcolor="#f82c73" align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
                <tr>
                  <td align="center" valign="top" style="padding: 40px 10px 40px 10px"></td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td bgcolor="#f82c73" align="center" style="padding: 0px 10px 0px 10px">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
                <tr>
                  <td
                    bgcolor="#12130f"
                    align="center"
                    valign="top"
                    style="
                      padding: 40px 20px 20px 20px;
                      border-radius: 4px 4px 0px 0px;
                      color: #111111;
                      font-family: 'Lato', Helvetica, Arial, sans-serif;
                      font-size: 48px;
                      font-weight: 400;
                      letter-spacing: 4px;
                      line-height: 48px;
                    "
                  >
                  <img src="https://i.ibb.co/Tc2DZ7W/logo6.png" width="200" height="140" style="display: block; border: 0px" />
                    <h1 style="font-size: 48px; font-weight: 400; margin: 10; color: white">Dobrodošli!</h1>
                  
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
                <tr>
                  <td
                    bgcolor="#ffffff"
                    align="left"
                    style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px"
                  >
                    <p style="margin: 0">Drago nam je da ste postali član naše zajednice. Međutim, prije nego počnemo, molimo Vas da verifikujete svoju email adresu klikom na dugme ispod:</p>
                  </td>
                </tr>
                <tr>
                  <td bgcolor="#ffffff" align="left">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px">
                          <table border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <td align="center" style="border-radius: 3px" bgcolor="#f82c73">
                                <a
                                  href="${url}"
                                  target="_blank"
                                  style="
                                    font-size: 20px;
                                    font-family: Helvetica, Arial, sans-serif;
                                    color: #ffffff;
                                    text-decoration: none;
                                    color: #ffffff;
                                    text-decoration: none;
                                    padding: 10px 25px;
                                    border-radius: 2px;
                                    border: 1px solid #f82c73;
                                    display: inline-block;
                                  "
                                  >Verifikuj email</a
                                >
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- COPY -->
                <tr>
                  <td
                    bgcolor="#ffffff"
                    align="left"
                    style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px"
                  >
                    <p style="margin: 0">Ako vam ne uspije verifikacije putem dugmeta, molimo Vas da iskopirate link za adresu u web browser koja se nalazi ispod:</p>
                  </td>
                </tr>
                <!-- COPY -->
                <tr>
                  <td
                    bgcolor="#ffffff"
                    align="left"
                    style="padding: 20px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px"
                  >
                    <p style="margin: 0; font-size: 12px"><a href="#" target="_blank" style="color: #f82c73">${url}</a></p>
                  </td>
                </tr>
                <tr>
                  <td
                    bgcolor="#ffffff"
                    align="left"
                    style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px"
                  >
                    <p style="margin: 0">Ako vam je potrebna bilo kakva pomoc, samo odgovorite nazad na ovu email adresu i tu smo za Vas</p>
                  </td>
                </tr>
                <tr>
                  <td
                    bgcolor="#ffffff"
                    align="left"
                    style="
                      padding: 0px 30px 40px 30px;
                      border-radius: 0px 0px 4px 4px;
                      color: #666666;
                      font-family: 'Lato', Helvetica, Arial, sans-serif;
                      font-size: 18px;
                      font-weight: 400;
                      line-height: 25px;
                    "
                  >
                    <p style="margin: 0">Ugodan dan,<br />Corinne's Accessories</p>
               
          </tr>
        </table>
        <div style="height: 70px"></div>
      </body>
    </html>`,
    });
    return res.status(201).json(`Verifikacioni email je poslat na adresu ${email}`);
  } catch (err) {
    return res.status(500).send(err);
  }
};

// //Login
// router.post("/login", async (req, res) => {
//   try {
//     const user = await User.findOne({ username: req.body.username });

//     !user && res.status(401).json("Wrong username");

//     const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.CRYPTO_SEC);
//     const TruePassword = hashedPassword.toString(CryptoJS.enc.Utf8);

//     TruePassword !== req.body.password && res.status(401).json("Wrong Password");

//     const accessToken = jwt.sign(
//       {
//         id: user._id,
//         isAdmin: user.isAdmin,
//       },
//       process.env.JWT_SEC,
//       { expiresIn: "1d" }
//     );

//     const { password, ...others } = user._doc;

//     res.status(200).json({ ...others, accessToken });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

exports.login = async (req, res) => {
  const { username, password } = req.body;
  // Check we have a username
  if (!username) {
    return res.status(422).send("Molimo vas da ukucate korisnicko ime!");
  }
  try {
    // Step 1 - Verify a user with the username
    const user = await User.findOne({ username }).exec();
    if (!user) {
      return res.status(404).json("Korisnik sa tim korisnickim imenom ne postoji!");
    }
    // Step 2 - Ensure the account has been verified
    if (!user.verified) {
      return res.status(403).json("Molimo vas da verifikujete vasu email adresu pomocu linka koji ste dobili na vas email!");
    }
    try {
      const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.CRYPTO_SEC);
      const TruePassword = hashedPassword.toString(CryptoJS.enc.Utf8);

      TruePassword !== req.body.password && res.status(401).json("Pogresna sifra!");

      const accessToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SEC,
        { expiresIn: "1d" }
      );

      const { password, ...others } = user._doc;

      res.status(200).json({ ...others, accessToken });
    } catch (error) {
      res.status(500).json(error);
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.verify = async (req, res) => {
  const token = req.params.id;
  console.log(req.params);

  // Check we have an id
  if (!token) {
    return res.status(422).json("Greska! Nepostojeci token");
  }
  // Step 1 -  Verify the token from the URL
  let payload = null;
  try {
    payload = jwt.verify(token, process.env.USER_VERIFICATION_TOKEN_SECRET);
  } catch (err) {
    return res.status(500).send(err);
  }
  try {
    // Step 2 - Find user with matching ID
    const user = await User.findOne({ _id: payload.ID }).exec();
    if (!user) {
      return res.status(404).json("Greska, Korisnik ne postoji");
    }
    // Step 3 - Update user verification status to true
    user.verified = true;
    await user.save();
    res.redirect("http://localhost:3000/login");
    return res.status(200).json("Uspjesno ste verifikovali vasu email adresu. Hvala Vam!");
  } catch (err) {
    return res.status(500).send(err);
  }
};
