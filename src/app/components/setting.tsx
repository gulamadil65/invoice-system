  // import { useState, ChangeEvent } from "react";

// export default function SettingPage() {
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     address1: "",
//     address2: "",
//     gst: "",
//     pan: "",
//     acName: "",
//     acNo: "",
//     bankname: "",
//     ifsc: "",
//     branch: "",
//     paymentPhone: "",
//     email: "",
//     facebook: "",
//     youtube: "",
//   });

//   const [logoImage, setLogoImage] = useState<File | null>(null);
//   const [paymentImage, setPaymentImage] = useState<File | null>(null);

//   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleImageUpload = (
//     e: ChangeEvent<HTMLInputElement>,
//     type: "logo" | "payment"
//   ) => {
//     const file = e.target.files?.[0] || null;
//     if (type === "logo") setLogoImage(file);
//     else setPaymentImage(file);
//   };

//   const handleSave = async () => {
//     const logoDataUrl = logoImage ? await toBase64(logoImage) : null;
//     const paymentDataUrl = paymentImage ? await toBase64(paymentImage) : null;

//     const businessProfile = {
//       ...formData,
//       logoDataUrl,
//       paymentDataUrl,
//     };

//     // Save to localStorage (or you can save to context or API as needed)
//     localStorage.setItem("businessProfile", JSON.stringify(businessProfile));
//     alert("Business profile saved successfully.");
//   };

//   const toBase64 = (file: File): Promise<string> =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result as string);
//       reader.onerror = error => reject(error);
//     });

    

//   return (
//     <div className="p-6 max-w-xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Business Settings</h1>

//       {Object.entries(formData).map(([key, value]) => (
//         <div key={key} className="mb-4">
//           <label className="block capitalize mb-1">{key}</label>
//           <input
//             type="text"
//             name={key}
//             value={value}
//             onChange={handleInputChange}
//             className="w-full border p-2 rounded"
//           />
//         </div>
//       ))}

//       <div className="mb-4">
//         <label className="block mb-1">Upload Logo</label>
//         <input type="file" accept="image/*" onChange={e => handleImageUpload(e, "logo")} />
//       </div>

//       <div className="mb-4">
//         <label className="block mb-1">Upload Payment QR</label>
//         <input type="file" accept="image/*" onChange={e => handleImageUpload(e, "payment")} />
//       </div>

//       <button
//         onClick={handleSave}
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         Save Business Profile
//       </button>
//     </div>
//   );
// }




import { useState, useEffect, ChangeEvent } from "react";
import { supabase } from "../utils/supabaseClient" // update path as per your project
import { fetchBusinessProfile } from "../utils/onlineStorage";
import { toast, ToastContainer } from 'react-toastify'



export default function SettingPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address1: "",
    address2: "",
    gst: "",
    pan: "",
    acName: "",
    acNo: "",
    ifsc: "",
    branch: "",
    paymentPhone: "",
    email: "",
    facebook: "",
    youtube: "",
  });

  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [paymentImage, setPaymentImage] = useState<File | null>(null);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchBusinessProfile();
        if (profile) {
          setFormData(profile);
          setIsUpdate(true);
        }
      } catch (error) {
        console.error("Error fetching business profile:", error);
      }
    };
    loadProfile();
  }, []);
  
  

  
  
  
  // const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({ ...prev, [name]: value }));
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const upperCaseFields = ["gst", "pan", "ifsc"];
    const updatedValue = upperCaseFields.includes(name) ? value.toUpperCase() : value;
    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
  };
  

  const handleImageUpload = (
    e: ChangeEvent<HTMLInputElement>,
    type: "logo" | "payment"
  ) => {
    const file = e.target.files?.[0] || null;
    if (type === "logo") setLogoImage(file);
    else setPaymentImage(file);
  };

  // const handleSave = async () => {
  //   const logoDataUrl = logoImage ? await toBase64(logoImage) : null;
  //   const paymentDataUrl = paymentImage ? await toBase64(paymentImage) : null;

  //   const businessProfile = {
  //     ...formData,
  //     logoDataUrl,
  //     paymentDataUrl,
  //   };

  //   localStorage.setItem("businessProfile", JSON.stringify(businessProfile));

  //   alert("Business profile saved successfully.");
  // };


  const handleSave = async () => {
    const logoDataUrl = logoImage ? await toBase64(logoImage) : null;
    const paymentDataUrl = paymentImage ? await toBase64(paymentImage) : null;
  
    const businessProfile = {
      ...formData,
      logoDataUrl,
      paymentDataUrl,
    };
  
    // const { data, error } = await supabase
    //   .from("business_profile")
      // .upsert([businessProfile], { onConflict: 'id' }); // or use id or user_id for conflict resolution
    //   const { data, error } = await supabase.from('business_profile').insert([businessProfile])

    //   // localStorage.setItem("businessProfile", JSON.stringify(businessProfile));


    // if (error) {
    //   console.error("Error saving profile:", error);
    //   alert("Failed to save business profile.");
    // } else {
    //   alert("Business profile saved to Supabase.");
    //   console.log('Data:', data) // 👈 use it like this
    // }
    const { error } = isUpdate
      ? await supabase
          .from("business_profile")
          .update(businessProfile)
          .eq("name", businessProfile.name) // Assuming you store the id
      : await supabase
          .from("business_profile")
          .insert(businessProfile);
  
    if (error) {
      console.error("Error saving:", error);
      toast.warn('Error saving')
    } else {
      alert(isUpdate ? "Updated successfully" : "Saved successfully");
      toast.success(isUpdate ? "Update successfully" : "Saved successfully")
    
      setIsUpdate(true); // Set to update mode after insert
    }
  
  };
  


  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });

  // useEffect(() => {
  //   const savedProfile = localStorage.getItem("businessProfile");
  //   if (savedProfile) {
  //     const profile = JSON.parse(savedProfile);

  //     setFormData({
  //       name: profile.name || "",
  //       phone: profile.phone || "",
  //       address1: profile.address1 || "",
  //       address2: profile.address2 || "",
  //       gst: profile.gst || "",
  //       pan: profile.pan || "",
  //       acName: profile.acName || "",
  //       acNo: profile.acNo || "",
  //       ifsc: profile.ifsc || "",
  //       branch: profile.branch || "",
  //       paymentPhone: profile.paymentPhone || "",
  //       email: profile.email || "",
  //       facebook: profile.facebook || "",
  //       youtube: profile.youtube || "",
  //     });

  //     if (profile.logoDataUrl) {
  //       fetch(profile.logoDataUrl)
  //         .then(res => res.blob())
  //         .then(blob => setLogoImage(new File([blob], "logo.png", { type: blob.type })));
  //     }

  //     if (profile.paymentDataUrl) {
  //       fetch(profile.paymentDataUrl)
  //         .then(res => res.blob())
  //         .then(blob => setPaymentImage(new File([blob], "payment.png", { type: blob.type })));
  //     }
  //   }
  // }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("business_profile")
        .select("*")
        .single();
  
      if (data) {
        setFormData({
          name: data.name || "",
          phone: data.phone || "",
          address1: data.address1 || "",
          address2: data.address2 || "",
          gst: data.gst || "",
          pan: data.pan || "",
          acName: data.acName || "",
          acNo: data.acNo || "",
          ifsc: data.ifsc || "",
          branch: data.branch || "",
          paymentPhone: data.paymentPhone || "",
          email: data.email || "",
          facebook: data.facebook || "",
          youtube: data.youtube || "",
        });
  
        if (data.logoDataUrl) {
          const res = await fetch(data.logoDataUrl);
          const blob = await res.blob();
          setLogoImage(new File([blob], "logo.png", { type: blob.type }));
        }
  
        if (data.paymentDataUrl) {
          const res = await fetch(data.paymentDataUrl);
          const blob = await res.blob();
          setPaymentImage(new File([blob], "payment.png", { type: blob.type }));
        }
      }
    };
  
    fetchProfile();
  }, []);
  

  

  return (
    <div className="p-6 max-w-xl mx-auto">
      <ToastContainer/>
      <h1 className="text-2xl font-bold mb-4">Business Settings</h1>

      {Object.entries(formData).map(([key, value]) => (
        <div key={key} className="mb-4">
          <label className="block capitalize mb-1">{key}</label>
          <input
            type="text"
            name={key}
            value={value}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>
      ))}

      <div className="mb-4">
        <label className="block mb-1">Upload Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => handleImageUpload(e, "logo")}
        />
        {/* {logoImage && (
          <div className="mt-2">
            <label className="block mb-1">Logo Preview</label>
            <img
              src={URL.createObjectURL(logoImage)}
              alt="Logo"
              className="h-24"
            />
          </div>
        )} */}
      </div>

      <div className="mb-4">
        <label className="block mb-1">Upload Payment QR</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => handleImageUpload(e, "payment")}
        />
        {/* {paymentImage && (
          <div className="mt-2">
            <label className="block mb-1">Payment QR Preview</label>
            <img
              src={URL.createObjectURL(paymentImage)}
              alt="Payment QR"
              className="h-24"
            />
          </div>
        )} */}
      </div>

      {/* <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Business Profile
      </button> */}
            {/* <button onClick={handleSave}>
        {isUpdate ? "Update" : "Save"}
      </button> */}

      <button
  onClick={handleSave}
  className={`px-6 py-2 rounded-2xl shadow-md font-medium transition duration-300 
    ${isUpdate 
      ? "bg-yellow-500 hover:bg-yellow-600 text-white" 
      : "bg-blue-600 hover:bg-blue-700 text-white"}`}
>
  {isUpdate ? "Update" : "Save"}
</button>


    </div>
  );
}
