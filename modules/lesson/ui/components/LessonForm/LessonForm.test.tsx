import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { LessonForm } from './LessonForm';
import type { ILesson } from '@/modules/lesson/core/models';

describe('LessonForm', () => {
  const t = (key: string) => key;
  const baseProps = {
    t,
    title: 'Test Title',
    description: 'Test Description',
    submitLabel: 'Submit',
    onSubmitLesson: jest.fn(),
    onCancel: jest.fn(),
  };

  it('renders form fields', () => {
    const { getByLabelText, getByText } = render(<LessonForm {...baseProps} />);
    expect(getByLabelText('form_topic')).toBeInTheDocument();
    expect(getByLabelText('form_participant')).toBeInTheDocument();
    expect(getByLabelText('form_date')).toBeInTheDocument();
    expect(getByLabelText('form_notes')).toBeInTheDocument();
    expect(getByText('Submit')).toBeInTheDocument();
  });

  it('calls onSubmitLesson when submitted', () => {
    const onSubmitLesson = jest.fn();
    const { getByText, getByLabelText } = render(
      <LessonForm {...baseProps} onSubmitLesson={onSubmitLesson} />
    );
    fireEvent.change(getByLabelText('form_topic'), { target: { value: 'Topic' } });
    fireEvent.change(getByLabelText('form_participant'), { target: { value: 'Name' } });
    fireEvent.change(getByLabelText('form_date'), { target: { value: '2026-03-21' } });
    fireEvent.submit(getByText('Submit').closest('form')!);
    expect(onSubmitLesson).toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = jest.fn();
    const { getByText } = render(
      <LessonForm {...baseProps} onCancel={onCancel} />
    );
    fireEvent.click(getByText('cancel'));
    expect(onCancel).toHaveBeenCalled();
  });
});
