var imageData = null;

function hasExtension(fileName, exts) {
  return new RegExp("(" + exts.join("|").replace(/\./g, "\\.") + ")$").test(
    fileName
  );
}

function limitCheck(file) {
  if (file.size > 5 * 1024 * 1024) {
    return false;
  } else {
    return true;
  }
}
function setdata(event) {
  imageData = event.files[0];
  console.log(event.files[0]);
  // console.log(limitCheck(imageData));
  if (limitCheck(imageData)) {
    if (
      hasExtension(imageData.name, [
        ".jpg",
        ".jpeg",
        ".bmp",
        ".gif",
        ".png",
        ".JPG",
        ".JPEG",
        ".BMP",
        ".GIF",
        ".PNG",
      ])
    ) {
      var formData = new FormData();
      formData.append("image", imageData);
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          window.location.replace(window.location.href);
        }
      };
      xhr.withCredentials = true;
      xhr.open("POST", `${window.location.href}image`);
      xhr.send(formData);
    } else {
      document.getElementsByTagName("input")[0].value = "";
      imageData = null;
      alert("only image need to be selected");
    }
  } else {
    document.getElementsByTagName("input")[0].value = "";
    imageData = null;
    alert("image size is out of limit");
  }
}

getImages = () => {
  function reqListener() {
    const res = JSON.parse(this.responseText);
    total = res.total;

    const imageContainer = document.getElementsByClassName("row")[0];
    for (let i = total - 1; i > -1; i--) {
      box = document.createElement("div");
      box.setAttribute("class", "col-md-4 col-sm-12");
      innerbox = document.createElement("div");
      innerbox.setAttribute("class", "box");
      imgTage = document.createElement("img");
      imgTage.setAttribute("src", `images/${res.url[i]}`);
      imgTage.setAttribute("class", "preview-image img-fluid");
      imgTage.setAttribute("id", res.url[i]);

      imgLabel = document.createElement("h6");
      imgLabel.innerText = res.url[i];

      innerbox.appendChild(imgTage);
      innerbox.appendChild(imgLabel);
      box.appendChild(innerbox);
      imageContainer.appendChild(box);
    }
  }

  var xhr = new XMLHttpRequest();
  xhr.onload = reqListener;
  xhr.open("GET", `${window.location.href}images`);
  xhr.send();
};

getImages();
