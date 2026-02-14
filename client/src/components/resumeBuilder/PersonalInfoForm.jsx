import {
  BriefcaseBusiness,
  Globe,
  Mail,
  MapPin,
  Phone,
  Linkedin,
  User
} from "lucide-react";
import React, { useEffect, useMemo } from "react";

function PersonalInfoForm({data,onChange,removeBackground,setRemoveBackground}) {

    const handleChange = (field, value) => {
        onChange({...data,[field]: value});
    }

    const fields = [
    { key: "full_name", label: "Full Name", icon: User, type: "text", required: true },
    { key: "email", label: "Email Address", icon: Mail, type: "email", required: true },
    { key: "phone", label: "Phone Number", icon: Phone, type: "tel" },
    { key: "location", label: "Location", icon: MapPin, type: "text" },
    { key: "profession", label: "Profession", icon: BriefcaseBusiness, type: "text" },
    { key: "linkedin", label: "LinkedIn Profile", icon: Linkedin, type: "url" },
    { key: "website", label: "Personal Website", icon: Globe, type: "url" }
  ];

  return (
    <div>
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        <p className="text-sm text-gray-600">Get started by filling in your personal details.</p>

        {/* Image Upload */}
        <div className="flex items-center gap-4 mt-4">
            <label className="cursor-pointer">
                {data.image ? (
                    <img src={typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image) } alt="user-image" className="w-16 h-16 rounded-full object-cover ring ring-slate-300 hover:opacity-80"/>
                ):(
                    <div className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-700">
                        <User className="size-10 p-2.5 border rounded-full"/>
                        Upload user Image
                    </div>
                )}
                <input type="file" accept='image.jpeg, image/png' className='hidden' onChange={(e) => handleChange("image",e.target.files[0])} />
            </label>
             
            {typeof data.image === 'object' && (
                <div className="flex flex-col gap-1 text-sm">
                    <p className="text-gray-600">Remove background</p>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={removeBackground}
                            onChange={() => setRemoveBackground((prev) => !prev)}
                        />
                        <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-600 transition-colors" />
                        <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
                    </label>
                </div>
            )}
        </div>

      {
        fields.map((field) => {
            const Icon = field.icon;
            return(
                <div key={field.key} className="space-y-1 mt-5" >
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <Icon className="size-4"/>
                        {field.label}
                        {field.required && <span className="text-red-500">*</span> }
                    </label>
                    <input 
                    type={field.type} 
                    value={data[field.key] || "" } 
                    onChange={(e) => handleChange(field.key,e.target.value) } 
                    placeholder={`Enter your ${field.label.toLowerCase()}`} 
                    required={field.required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                </div>
            )
        })
      }      


    </div>
  )
}

export default PersonalInfoForm