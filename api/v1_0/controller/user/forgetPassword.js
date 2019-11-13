//Section Include
var logger = require("../../../../logger/logger");
var queryFunc = require("../../../helpFunction/queryFunction");
var mailer = require("nodemailer");
const crypto = require("crypto");

//Section CURD
exports.func_get = function(email, res) {
  main(email, res);
};

//Section Method
async function main(email, res) {
  try {
    q =
      'SELECT "MEM_PASSWORD" FROM "T_MEMBER_LOGIN" where "MEM_USERNAME" = $1 and "MEM_LOGIN_TYPE" = 1';
    var { rows } = await queryFunc.queryRow(q, [email]);
    if (rows.length > 0) {
      const algorithm = "aes-256-cbc";
      const secretkey = "qazxswedcvfrtgb";
      password = rows[0].MEM_PASSWORD;
      const decipher = crypto.createDecipher(algorithm, secretkey);
      var decrypted = decipher.update(password, "hex", "utf8");
      decrypted += decipher.final("utf8");
      var smtp = {
        host: "smtp.office365.com", // Office 365 server
        port: 587, //25, 465, 587 depend on your
        secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
        auth: {
          // type: "oauth2",
          user: "backend.ielt@iel.co.th", //user account
          pass: "fstm0014@y2" //user password
        },
        requireTLS: true,
        tls: {
          ciphers: "SSLv3"
        }
      };
      var smtpTransport = mailer.createTransport(smtp);

      var mail = {
        from: "backend.ielt@iel.co.th", //from email (option)
        to: email, //to email (require)
        subject: "INTER EXPRESS LOGISTICS TECHNOLOGY", //subject
        html: "<p>รหัสผ่านของคุณ คือ" + decrypted + "</p>" //email body
        //   text: "รหัสผ่านของคุณ คือ" + password
      };

      smtpTransport.sendMail(mail, function(err, response) {
        smtpTransport.close();
        if (err) {
          //error handler
          // console.log("Send mail " + err);
          // res.send("Send mail " + err);
          res.status(200).json({
            STATUS: 0,
            RESULT: "SEND MAIL " + err
          });
        } else {
          //success handler
          res.status(200).json({
            STATUS: 1,
            RESULT: "SUCCESS"
          });
          // console.log("send email success");
        }
      });
    } else {
      var bNull = [];
      res.status(200).json({
        STATUS: 3,
        RESULT: []
      });
    }
  } catch (err) {
    logger.error("Database:::::::" + err);
    res.status(200).json({
      STATUS: 0,
      RESULT: "DATABASE " + err
    });
  }
}
