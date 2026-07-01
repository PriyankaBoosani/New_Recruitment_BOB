import React, { useEffect, useState } from "react";
import { Button, Card, Form, Row, Col } from "react-bootstrap";
import DynamicField from "./DynamicField";

const FIELD_TYPES = [
  { label: "Textbox", value: "text" },
  { label: "Dropdown", value: "dropdown" },
  { label: "Date", value: "date" },
];

const FormBuilder = ({ initialSchema, onSave }) => {
  const [title, setTitle] = useState("");
  const [fields, setFields] = useState([]);
  const [generatedJson, setGeneratedJson] = useState(null);
  useEffect(() => {
    if (initialSchema) {
      setTitle(initialSchema.title || "");
      setFields(initialSchema.fields || []);
    }
  }, [initialSchema]);

  const addField = (type) => {
    const field = {
      id: crypto.randomUUID(),
      type,
      label: "",
      required: false,
    };

    if (type === "text") {
      field.placeholder = "";
      field.maxLength = 100;
    }

    if (type === "dropdown") {
      field.options = [""];
    }

    setFields((prev) => [...prev, field]);
  };

  const updateField = (id, key, value) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === id
          ? {
              ...field,
              [key]: value,
            }
          : field
      )
    );
  };

  const removeField = (id) => {
    setFields((prev) => prev.filter((field) => field.id !== id));
  };

  const addOption = (fieldId) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === fieldId
          ? {
              ...field,
              options: [...field.options, ""],
            }
          : field
      )
    );
  };

  const updateOption = (fieldId, index, value) => {
    setFields((prev) =>
      prev.map((field) => {
        if (field.id !== fieldId) return field;

        const options = [...field.options];
        options[index] = value;

        return {
          ...field,
          options,
        };
      })
    );
  };

  const removeOption = (fieldId, index) => {
    setFields((prev) =>
      prev.map((field) => {
        if (field.id !== fieldId) return field;

        return {
          ...field,
          options: field.options.filter((_, i) => i !== index),
        };
      })
    );
  };

  const handleSave = () => {
    const schema = {
      formId: crypto.randomUUID(),
      title,
      fields,
    };

    console.log("Generated Form JSON:", schema);

    onSave(schema);
  };
  useEffect(() => {
  if (initialSchema) {
    setTitle(initialSchema.title || "");
    setFields(initialSchema.fields || []);
  }
}, [initialSchema]);
  return (
    <>
      <div className="d-flex gap-2 mb-3">
        {FIELD_TYPES.map((field) => (
          <Button key={field.value} onClick={() => addField(field.value)}>
            + {field.label}
          </Button>
        ))}
      </div>

      {fields.map((field) => (
        <DynamicField
          key={field.id}
          field={field}
          updateField={updateField}
          removeField={removeField}
          addOption={addOption}
          updateOption={updateOption}
          removeOption={removeOption}
        />
      ))}

      <div className="text-end mt-4">
        <Button onClick={handleSave}>Save Form</Button>
      </div>
      
    </>
  );
};

export default FormBuilder;
