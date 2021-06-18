console.log("content script js");

const allImageLinks = [];

const intervalId = setInterval(() => {
  const nextBtn = document.querySelector(".go-fwd");
  if (nextBtn) {
    nextBtn.click();
    const imageLinksOfCurrentPage = Array.from(
      document.querySelectorAll(".mainsvg")
    );
    console.log(imageLinksOfCurrentPage);
    for (let i = 0; i < imageLinksOfCurrentPage.length; i++) {
        console.log(imageLinksOfCurrentPage[i]);
      if (imageLinksOfCurrentPage[i].src && imageLinksOfCurrentPage[i].getElementsByClassName.visibility!="hidden") {
        console.log("src", imageLinksOfCurrentPage[i].src);
        allImageLinks.push(imageLinksOfCurrentPage[i].src)
      }
    }
  } else {
    clearInterval(intervalId);
  }
}, 4000);

// think about how to earn money from this 
// will create an array of images containing svgs and jpgs
// now we need to convert it to pdf 
// create a website that will accept a link of magzter 
// create an api in nodejs which will accept array of images and create a pdf
// now ask user for his/her email this way you will gather emails 
// now mail him/her the pdf or you can give link to download or directly download the file on user's pc