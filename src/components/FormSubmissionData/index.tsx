import React from 'react';
import './index.scss'

interface FormSubmissionDataProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
}

export const FormSubmissionData: React.FC<FormSubmissionDataProps> = ({ data }) => {

    const formData = data?.customData

  return (
    <div className="form-submission-data">
      <h3 className='title'>Submission Data</h3>
        {formData.map((item: { label: string, value: string }, index: number) => (
          <div key={index} className='data'>
            <p className='label'>{item.label}</p> <p className='value'>{item.value}</p>
          </div>
        ))}
    </div>
  );
};