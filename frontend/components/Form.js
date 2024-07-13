import React, { useEffect, useState } from "react";
import * as yup from "yup";
import axios from "axios";

// initial values
const initialFormValues = {
  fullName: "",
  size: "",
  toppings: [],
};

const initialErrorsValues = {
  fullName: "",
  size: "",
};

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: "full name must be at least 3 characters",
  fullNameTooLong: "full name must be at most 20 characters",
  sizeIncorrect: "size must be S or M or L",
};

// 👇 Here you will create your schema.
const orderSchema = yup.object().shape({
  fullName: yup
    .string()
    .trim()
    .required("First and last name is required!")
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong),
  size: yup.string().trim().required(validationErrors.sizeIncorrect),
  toppings: yup.array(),
});

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { id: "1", text: "Pepperoni" },
  { id: "2", text: "Green Peppers" },
  { id: "3", text: "Pineapple" },
  { id: "4", text: "Mushrooms" },
  { id: "5", text: "Ham" },
];

const sizes = [
  { id: "S", text: "Small" },
  { id: "M", text: "Medium" },
  { id: "L", text: "Large" },
];

export default function Form() {
  // States
  const [values, setValues] = useState(initialFormValues);
  const [errors, setErrors] = useState(initialErrorsValues);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [serverSuccess, setServerSuccess] = useState("");
  const [serverFail, setServerFail] = useState("");

  const validate = (name, value) => {
    yup
      .reach(orderSchema, name)
      .validate(value)
      .then(() => setErrors({ ...errors, [name]: "" }))
      .catch((err) => setErrors({ ...errors, [name]: err.errors[0] }));
  };

  const onChange = (evt) => {
    const { type, id, value, checked } = evt.target;

    if (type === "checkbox") {
      // If the checkbox is checked, add the value to the toppings array
      // If the checkbox is unchecked, remove the value from the toppings array

      // if (checked) {
      //   const currentToppings = [...values.toppings, value];
      //   setValues({ ...values, toppings: currentToppings });
      // } else {
      //   const currentToppings = values.toppings.filter(
      //     (topping) => topping !== value
      //   );
      //   setValues({ ...values, toppings: currentToppings });
      // }

      // or as a one-liner
      const currentToppings = checked
        ? [...values.toppings, value]
        : values.toppings.filter((topping) => topping !== value);

      setValues({ ...values, toppings: currentToppings });

    } else {
      validate(id, value);
      setValues({ ...values, [id]: value });
    }
  };

  const onSubmit = (evt) => {
    evt.preventDefault();
    // TODO send form to server, catch errors
    axios
      .post("http://localhost:9009/api/order", values)
      .then((res) => {
        setServerSuccess(res.data.message);
        setServerFail();
        setValues(initialFormValues);
        setErrors(initialErrorsValues);
      })
      .catch((err) => {
        setServerFail(err.response.data.message);
        setServerSuccess();
      });
  };

  useEffect(() => {
    orderSchema.isValid(values).then((valid) => setSubmitDisabled(!valid));
  }, [values]);

  return (
    <form onSubmit={onSubmit}>
      <h2>Order Your Pizza</h2>
      {serverSuccess && <div className="success">{serverSuccess}</div>}
      {serverFail && <div className="failure">{serverFail}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label>
          <br />
          <input
            placeholder="Type full name"
            id="fullName"
            type="text"
            onChange={onChange}
            value={values.fullName}
          />
        </div>
        {errors.fullName && <div className="error">{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label>
          <br />
          <select id="size" onChange={onChange} value={values.size}>
            <option value="">----Choose Size----</option>
            {/* Dynamically generate sizes */}
            {sizes.map((size, idx) => (
              <option key={idx} value={size.id}>
                {size.text}
              </option>
            ))}
          </select>
        </div>
        {errors.size && <div className="error">{errors.size}</div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        {toppings.map((topping, idx) => (
          <label key={idx}>
            <input
              name={topping.id}
              value={topping.id}
              type="checkbox"
              onChange={onChange}
              checked={values.toppings.includes(topping.id)}
            />
            {topping.text}
            <br></br>
          </label>
        ))}
      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input type="submit" disabled={submitDisabled} />
    </form>
  );
}
