const nodemailer = require("nodemailer");
const Product = require("../models/Product");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const doSomethingAsync = async (item) => {
  return findProduct(item);
};

const findProduct = async (item) => {
  const singleProduct = await Product.findById(item._id);
  const { title, img, price } = singleProduct;
  return Promise.resolve({ quantity: item.quantity, name: title, img, price, color: item.color, size: item.size });
};

const getData = async (product) => {
  return Promise.all(product.map((item) => doSomethingAsync(item)));
};

const sasa = (items) => {
  const names = [];
  items.map((item) => {
    names.push(
      `  <table class="table"><tr class="trow"><td class="imageTd"><img class="image" src="${item.img}"/></td><td class="productInfoTd"><div class="product">${item.name} x ${
        item.quantity
      }</div><table><tr><td><div class="colorContainer">Boja:</div></td><td class="colorTd"><span class="color" style="background: ${
        item.color
      }"></span></td></tr></table><div class="size">Velicina: <span>${item.size}</span></div></td><td class="priceContainerTd"><div class="price">${
        item.price * item.quantity
      } KM</div></td></tr></table>`
    );
  });
  const solved = names.join("");
  return `${solved}`;
};

const sendEmail = async (email, name, address, product, total) => {
  const data = await getData(product).then((list) => {
    const profi = sasa(list);
    return profi;
  });

  await transporter.sendMail({
    to: email,
    subject: "Vasa narudzba je zaprimljena. Zahvaljujemo se",
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
          padding: 20px !important;
          width: 100% !important;
        }
        .image {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
          object-fit: cover;
          
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

        .container {
          width: 100%;
          padding: 10px;
          border: 1px solid lightgray;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        .table {
          border-bottom: 1px solid lightgray;
          font-size: 12px;
          color: rgb(70, 70, 70);
          width: 100%;
        }
        .trow {
          width: 100%;
        }
        .imageTd {
          width:60px;
          height:60px;
          
  
        }
        .image {
          
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit:cover;
        }
        .productInfoTd {
  
        }
        .colorContainer {
          color: gray;
          display: inline-block;
     
          
        }
        .colorTd {
          padding-top: 7px;
          padding-left: 3px;
        }
  
        .color {
          display: inline-block;
         
          width: 20px;
          height: 20px;
          object-fit:cover;
   
          border-radius: 50%;
     
         
  
        }
        .size {
          color: gray;
     
        
  
        }
        .size > span {
          color: black;
          font-weight: bold;
          text-transform: uppercase;
        }
        .priceContainerTd {
          margin-left: auto;
          
        }
        .price {
          text-align: right;
          font-weight: bold;
        }
      .totalContainer {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          border-top: 1px solid rgba(0, 0, 0, 0.075);
          color: black;
          font-weight: bold;
      }
      .total  {
         display: block;
         width: 100%;
         text-align: right;
         float: right;
      }
      .total > span {
        padding-left: 10px;
      }



      </style>
    </head>
  
    <body style="background-color: #a9a9a9; margin: 0 !important; padding: 0 !important">
      <!-- HIDDEN PREHEADER TEXT -->
      <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden">
       Vasa narudzba je zaprimljena. - Corrine's Accessories
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
                  <h1 style="font-size: 48px; font-weight: 400; margin: 10; color: white">Hvala Vam!</h1>
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
                  style="padding: 20px 30px 10px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px; width: 100%;"
                >
                  <p style="margin: 0">Pozdrav, <strong>${name}</strong>.</p><p> Vasa narudzba je zaprimljena! Trenutno radimo na <strong>procesuiranju</strong>  narudzbe. Bicete obavjesteni novim emailom kada vasa narudzba bude poslata.</p><p>Detalji vase narudzbe :</p>
                  <div class="container">
                 
                  ${data}
                  <div class="totalContainer"><p class="total">UKUPNO<span>${total.toFixed(2)} KM</span></p></div>
                  </div>
                </td>
              </tr>
            
              <!-- COPY -->
              <tr>
                <td
                  bgcolor="#ffffff"
                  align="left"
                  style="padding: 0px 10px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px"
                >
                  <p style="margin: 0">Na nasoj web stranici mozete pratiti sve vase narudzbe!</p>
                </td>
              </tr>
              <!-- COPY -->
              <tr>
                <td
                  bgcolor="#ffffff"
                  align="left"
                  style="padding: 0px 30px 10px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 15px"
                >
                  <p style="margin: 0"><a href="#" target="_blank" style="color: #f82c73"></a></p>
                </td>
              </tr>
              <tr>
                <td
                  bgcolor="#ffffff"
                  align="left"
                  style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px"
                >
                  <p style="margin: 0">Ako vam je potrebna bilo kakva pomoc, samo odgovorite nazad na ovu email adresu i tu smo za Vas!</p>
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
                  <p style="margin: 0">Ugodan dan,<br /><strong>Corinne's Accessories</strong></p>
             
        </tr>
      </table>
      <div style="height: 70px"></div>
    </body>
  </html>`,
  });
};

exports.sendEmail = sendEmail;
