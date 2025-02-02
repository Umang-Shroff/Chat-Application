import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../../components/Loader/Loader";
// Cloudinary Upload preset = uploadPresetTry

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imgPreview, setImgPreview] = useState(null);
  const [profileImg, setProfileImg] = useState("");

  const handleImgChange = (e) => {
    setProfileImg(e.target.files[0]);
    setImgPreview(URL.createObjectURL(e.target.files[0]));
  };

  const removePreview = () => {
    setImgPreview(null);
    setProfileImg("");
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let imageURL;
      if(profileImg && (
        profileImg.type === "image/png" ||
        profileImg.type === "image/jpg" ||
        profileImg.type === "image/jpeg" 
      )){
        const image = new FormData()
        image.append("file",profileImg)
        image.append("cloud_name","dcj1mzpyc")
        image.append("upload_preset","uploadPresetTry")
        const response = await axios.post("https://api.cloudinary.com/v1_1/dcj1mzpyc/image/upload",image)
        
        imageURL = response.data.secure_url;
        setImgPreview(null)
      }
      // alert(imageURL)
      console.log("Data sent: ", { name, email, imageURL });
      await axios.post("/api/register", { name, email, password, imageURL });
      console.log("Data registered: ", { name, email, imageURL });
      toast.success("Success registered");
      navigate("/login");
    } catch (error) {
      console.log("Error on RegisterPage client: ", error);
      toast.error("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
        {/* Background Blurred Circles */}
        <div className="absolute w-72 h-72 bg-[rgba(79,70,229,0.35)] rounded-full blur-[100px] top-10 left-10 sm:w-96 sm:h-96 md:w-[350px] md:h-[350px] lg:w-72 lg:h-72"></div>
        <div className="absolute w-96 h-96 bg-[rgba(79,70,229,0.35)] rounded-full blur-[100px] top-1/2 right-10 sm:w-[400px] sm:h-[400px] md:w-[450px] md:h-[450px] lg:w-96 lg:h-96"></div>
        <div className="absolute w-48 h-48 bg-[rgba(79,70,229,0.35)] rounded-full blur-[100px] bottom-10 left-1/2 transform -translate-x-1/2 sm:w-72 sm:h-72 md:w-[250px] md:h-[250px] lg:w-48 lg:h-48"></div>
        {isLoading && (
          <div className="absolute z-20 h-screen top-0 left-0 bg-black/55 flex flex-col justify-center items-center w-full">
            <Loader />
          </div>
        )}

        {/* Register Form */}
        <div className="relative bg-white p-8 rounded-lg shadow-xl z-10 w-full max-w-md">
          <h1 className="text-3xl sm:text-4xl text-center mb-6 text-blue-700 font-semibold">
            Register
          </h1>
          <form
            className="space-y-4 w-full mx-auto"
            onSubmit={(e) => registerUser(e)}
          >
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* <label className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">Photo: (Optional)</label> */}
            <input
              type="file"
              style={{color:'rgb(156 , 163, 175)'}}
              onChange={handleImgChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {imgPreview && (
              <div className="flex justify-center items-center gap-3">
                <div className="text-black font-semibold">
                  Profile Preview:{" "}
                </div>{" "}
                <img
                  className="border-black border rounded-full w-20 h-20"
                  src={imgPreview}
                  alt="profileImg"
                />{" "}
                <div
                  onClick={removePreview}
                  className="font-semibold border bg-blue-200 rounded-lg px-2 py-1 cursor-pointer"
                >
                  X
                </div>{" "}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Register
            </button>
            <div className="text-center py-2 text-gray-500 text-sm sm:text-base">
              Already have an account?{" "}
              <a className="underline text-black" href="/login">
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
