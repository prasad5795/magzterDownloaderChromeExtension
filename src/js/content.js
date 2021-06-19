import axios from "axios";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

console.log("content script js");

const allImageLinks = [];
let readingMagzine = false;
let pageNumber = 0;

const intervalId = setInterval(() => {
  const nextBtn = document.querySelector(".go-fwd");
  if (nextBtn && !Array.from(nextBtn.classList).includes("gone")) {
    readingMagzine = true;
    console.log(
      "found nxt btn",
      nextBtn,
      Array.from(nextBtn.classList),
      Array.from(nextBtn.classList).includes("gone")
    );
    nextBtn.click();
    const imageLinksOfCurrentPage = Array.from(
      document.querySelectorAll(".mainsvg")
    );
    console.log(imageLinksOfCurrentPage);
    for (let i = 0; i < imageLinksOfCurrentPage.length; i++) {
      //   console.log(imageLinksOfCurrentPage[i]);
      console.log(imageLinksOfCurrentPage[i].style.visibility);
      if (
        imageLinksOfCurrentPage[i].src &&
        imageLinksOfCurrentPage[i].getElementsByClassName.visibility != "hidden"
      ) {
        allImageLinks.push(imageLinksOfCurrentPage[i].src);
        pageNumber += 1;
        const img = new Image();
        img.setAttribute("crossorigin", "anonymous");
        img.src = imageLinksOfCurrentPage[i].src;
        img.id = "page-" + pageNumber;
        document.body.appendChild(img);
      }
    }
  } else if (readingMagzine) {
    console.log("readingMagzine");
    console.log("coundnt found nxt btn");

    readingMagzine = false;
    const imageLinksOfCurrentPage = Array.from(
      document.querySelectorAll(".mainsvg")
    );
    console.log(imageLinksOfCurrentPage);
    for (let i = 0; i < imageLinksOfCurrentPage.length; i++) {
      if (
        imageLinksOfCurrentPage[i].src &&
        imageLinksOfCurrentPage[i].style.visibility != "hidden"
      ) {
        console.log(imageLinksOfCurrentPage[i].style.visibility);
        allImageLinks.push(imageLinksOfCurrentPage[i].src);
        pageNumber += 1;
        const img = new Image();
        img.setAttribute("crossorigin", "anonymous");
        img.src = imageLinksOfCurrentPage[i].src;
        img.id = "page-" + pageNumber;
        document.body.appendChild(img);
      }
    }

    const addedImageElements = Array.from(
      document.querySelectorAll("img")
    ).filter((img) => img.id.includes("page-"));
    console.log(addedImageElements);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const dataURIs = [];
    PDFDocument.create().then(async (pdfDoc) => {
      console.log("pdf created");
      for (let i = 0; i < addedImageElements.length; i++) {
        const imgElement = addedImageElements[i];
        // Set width and height
        canvas.width = imgElement.width;
        canvas.height = imgElement.height;
        // Draw the image
        ctx.drawImage(imgElement, 0, 0);
        console.log();
        const dataURI = canvas.toDataURL("image/png");
        dataURIs.push(dataURI);

        // for (let i = 0; i < imageUrls.length; i++) {
        // const dataURI = imageUrls[i];
        const img = await pdfDoc.embedPng(dataURI);
        const imagePage = pdfDoc.insertPage(i);
        imagePage.drawImage(img, {
          x: 0,
          y: 0,
          width: imagePage.getWidth(),
          height: imagePage.getHeight(),
        });
        console.log("page added", i);
      }
      const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
      var a = document.createElement("a");
      a.href = pdfDataUri;
      a.download = "test.pdf";
      document.body.appendChild(a);
      console.log("element created and goign tp click", a);
      a.click();
    });

    // axios({
    //   method: "post",
    //   url: "http://localhost:8080/api/createmagzine",
    //   data: {
    //     allImageLinks: dataURIs,
    //   },
    // }).then((dataURI) => {
    //   var a = document.createElement("a");
    //   a.href = dataURI;
    //   a.download = "test.pdf";
    //   document.body.appendChild(a);
    //   a.click();
    // });
    clearInterval(intervalId);
  } else {
    clearInterval(intervalId);
  }
}, 1000);

// think about how to earn money from this
// will create an array of images containing svgs and jpgs
// now we need to convert it to pdf
// create a website that will accept a link of magzter
// create an api in nodejs which will accept array of images and create a pdf
// now ask user for his/her email this way you will gather emails
// now mail him/her the pdf or you can give link to download or directly download the file on user's pc
