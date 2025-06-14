import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAPI } from '../../../contexts/Apicontext';
import { toast } from 'react-toastify';

const AddSchedule = ({ groupId,onSaved }) => {
  const { register, handleSubmit, reset } = useForm();
  const { addSchedule } = useAPI();
  const [loading, setLoading] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const onSubmit = async (data) => {
    if (!groupId) return toast.error("Missing group ID");

    const payload = {
      groupId,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime
    };

    setLoading(true);
    try {
      const res = await addSchedule(payload);
      if (res.success) {
        toast.success(res.message || 'Schedule saved');
        onSaved();
        reset();
      } else {
        toast.error(res.message || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h5 className="mt-5 mb-3 fw-semibold" style={{ color: '#333' }}>
        Add / Update Schedule
      </h5>

      <form onSubmit={handleSubmit(onSubmit)} className="row g-3 align-items-end">

        <div className="col-md-3">
          <label htmlFor="dayOfWeek" className="form-label">Day of Week</label>
          <select
            className="form-select rounded-pill px-3 py-3"
            id="dayOfWeek"
            {...register('dayOfWeek')}
            required
          >
            <option value="">Select Day</option>
            {days.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label htmlFor="startTime" className="form-label">Start Time</label>
          <input
            type="time"
            className="form-control px-3 py-1"
            id="startTime"
            {...register('startTime')}
            required
          />
        </div>

        <div className="col-md-3">
          <label htmlFor="endTime" className="form-label">End Time</label>
          <input
            type="time"
            className="form-control  px-3 py-1"
            id="endTime"
            {...register('endTime')}
            required
          />
        </div>

        <div className="col-md-3 d-grid">
          <button
            type="submit"
            className="btn mx-2 rounded  btns poppins-medium  "
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </>
  );
};

export default AddSchedule;
