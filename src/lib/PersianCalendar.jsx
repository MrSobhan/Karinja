import React, { useState, useRef, useEffect } from "react";
import moment from "moment-jalaali";
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from "react-icons/fa";

// Initialize moment-jalaali
moment.loadPersian({ dialect: "persian-modern" });

const PersianCalendar = ({ onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(null);

  // Get current month and year in Persian
  const currentMonth = currentDate.format("jMMMM");
  const currentYear = currentDate.format("jYYYY");

  // Get days in the current month
  const daysInMonth = moment.jDaysInMonth(
    currentDate.jYear(),
    currentDate.jMonth()
  );
  const firstDayOfMonth = moment(currentDate)
    .startOf("jMonth")
    .day();

  // Generate days for the calendar
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-10"></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const isSelected =
      selectedDate &&
      selectedDate.isSame(
        moment(currentDate).jDate(day),
        "day"
      );
    days.push(
      <div
        key={day}
        className={`h-10 flex items-center justify-center cursor-pointer rounded-full ${
          isSelected ? "bg-blue-500 text-white" : "hover:bg-gray-100"
        }`}
        onClick={() => {
          const newSelectedDate = moment(currentDate).jDate(day);
          setSelectedDate(newSelectedDate);
          onSelectDate(newSelectedDate);
        }}
      >
        {day}
      </div>
    );
  }

  // Navigate to previous/next month
  const goToPreviousMonth = () => {
    setCurrentDate(moment(currentDate).subtract(1, "jMonth"));
  };

  const goToNextMonth = () => {
    setCurrentDate(moment(currentDate).add(1, "jMonth"));
  };

  return (
    <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg z-10">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <FaChevronRight />
        </button>
        <h2 className="text-lg font-bold">
          {currentMonth} {currentYear}
        </h2>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <FaChevronLeft />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center w-64">
        {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((day, index) => (
          <div key={index} className="font-semibold text-gray-600">
            {day}
          </div>
        ))}
        {days}
      </div>
      {selectedDate && (
        <div className="mt-4 text-center">
          <p className="text-gray-700">
            تاریخ انتخاب‌شده: {selectedDate.format("jYYYY/jMM/jDD")}
          </p>
        </div>
      )}
    </div>
  );
};

const PersianDatePicker = ({ onDateChange }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const calendarRef = useRef(null);
  const buttonRef = useRef(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle date selection
  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
    if (onDateChange) {
      onDateChange(date); // Pass selected date to parent
    }
  };

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg"
      >
        <FaCalendarAlt />
        <p className="mt-1">{selectedDate ? selectedDate.format("jYYYY/jMM/jDD") : "انتخاب تاریخ"}</p>
      </button>
      {isCalendarOpen && (
        <div
          ref={calendarRef}
          className="absolute top-full left-0 mt-2 z-20"
        >
          <PersianCalendar onSelectDate={handleSelectDate} />
        </div>
      )}
    </div>
  );
};


export default PersianDatePicker;