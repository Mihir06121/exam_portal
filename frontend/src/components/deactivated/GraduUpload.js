import Resizer from "react-image-file-resizer";
import axios from "axios";

const FileUpload = ({ values, setValues }) => {

  const fileUploadAndResize = (e) => {
    let files = e.target.files;
    let allUploadedFiles = values.graduationCertificate;

    if (files) {
      for (let i = 0; i < files.length; i++) {
        Resizer.imageFileResizer(
          files[i],
          720,
          720,
          "JPEG",
          100,
          0,
          (uri) => {
            axios
              .post(
                `http://localhost:8000/api/doc/uploadimages`,
                { image: uri }
              )
              .then((res) => {
                allUploadedFiles = res.data;
                setValues({ ...values, graduationCertificate: allUploadedFiles });
              })
              .catch((err) => {
              });
          },
          "base64"
        );
      }
    }
  };

  const handleImageRemove = (public_id) => {
    axios
      .post(
        `http://localhost:8000/api/doc/deleteimage`,
        { public_id }
      )
      .then((res) => {
        const { graduationCertificate } = values;
    setValues({ ...values, graduationCertificate: {} });
      })
      .catch((err) => {
      });
  };

  return (
    <>
      <div className="row py-md-3">
        <label className="btn btn-primary btn-raised mt-3">
          Upload Graduation Certificate
          <input
            type="file"
            multiple
            hidden
            accept="images/*"
            onChange={fileUploadAndResize}
          />
        </label>
      </div>
      <div className="row">
        <img src={values.graduationCertificate.url} className="card-img-top" alt="..."/>
        <button type="button" onClick={() => handleImageRemove(values.graduationCertificate.public_id)} className="btn btn-sm btn-outline-danger">Delete</button>
      </div>
    </>
  );
};

export default FileUpload;
