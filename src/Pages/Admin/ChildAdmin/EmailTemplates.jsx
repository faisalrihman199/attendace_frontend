import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoMdHelpCircleOutline } from 'react-icons/io';
import { toast } from 'react-toastify';
import { useAPI } from '../../../contexts/Apicontext';

const EmailTemplates = () => {
    const { register, handleSubmit, setValue } = useForm();
    const [loading, setLoading] = useState(false);
    const { allTemplates, saveTemplete } = useAPI();

    // Dummy template options array
    const [templateOptions, setTemplates] = useState([]);
    
    // Fetch templates on component mount
    useEffect(() => {
        allTemplates()
            .then((res) => {
                console.log("Response:", res);
                setTemplates(res.data);
            })
            .catch((err) => {
                console.log("Error:", err);
            });
    }, []);

    // Handle the form submission
    const handleEmailTemplateSubmit = (data) => {
        if (!data.id || !data.senderName || !data.subject || !data.htmlContent) {
            toast.error("Please fill all the fields");
            return;
        }
        console.log("Data to be sent to server", data);

        setLoading(true);
        saveTemplete(data)
            .then((res) => {
                if (res.success) {
                    toast.success(res.message);
                } else {
                    toast.error(res.message);
                }
            })
            .catch((err) => {
                console.log("Error in saving template", err);
                toast.error(err.response?.data?.message || "Error in saving template");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Handle the download of template
    const downloadTemplate = () => {
        const link = document.createElement('a');
        link.href = '/templates.xlsx';
        link.download = 'templates.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Handle template selection and fill the form with the selected template's data
    const handleTemplateChange = (e) => {
        const selectedTemplate = templateOptions.find(template => template.id === parseInt(e.target.value));
        
        if (selectedTemplate) {
            // Fill in the form fields using setValue from react-hook-form
            setValue('id', selectedTemplate.id);
            setValue('senderName', selectedTemplate.senderName);
            setValue('subject', selectedTemplate.subject);
            setValue('htmlContent', selectedTemplate.htmlContent);
        }
    };

    return (
        <div className="container p-4 poppins-regular">
            <div className="mt-3">
                <h1 className="top_heading poppins-medium color_bao">
                    Email Template
                    <span
                        className="ms-2 color_bao"
                        style={{ cursor: 'pointer' }}
                        onClick={downloadTemplate}
                        title="Download Template"
                    >
                        <IoMdHelpCircleOutline size={25} />
                    </span>
                </h1>

                <div className="my-2">
                    <form onSubmit={handleSubmit(handleEmailTemplateSubmit)}>
                        <div className="mb-3">
                            <label className="form-label">Template Name</label>
                            <select
                                className="form-control p-2 bg_dede"
                                {...register('id')}
                                onChange={handleTemplateChange}
                            >
                                <option value="">Select Template</option>
                                {templateOptions.map(option => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Send From</label>
                            <input
                                type="text"
                                className="form-control p-2 bg_dede"
                                placeholder="Sender Name"
                                {...register('senderName')}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Subject</label>
                            <input
                                type="text"
                                className="form-control p-2 bg_dede"
                                placeholder="Subject"
                                {...register('subject')}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Message Body</label>
                            <textarea
                                className="form-control p-2 bg_dede"
                                placeholder="HTML Content"
                                rows={5}
                                style={{ resize: 'none' }}
                                {...register('htmlContent')}
                            ></textarea>
                        </div>

                        <div className="my-2 d-flex justify-content-end">
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Saving...
                                </>
                            ) : (
                                <button className="btn mx-2 btns poppins-medium" style={{ width: '150px' }} type="submit">
                                    Save
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmailTemplates;
