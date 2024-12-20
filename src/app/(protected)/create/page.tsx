'use client';

import { create } from '@/lib/forms/actions';
import React from 'react';
import { useRouter } from 'next/navigation';
import { UniversalForm } from '@/components/app/UniversalForm/UniversalForm';

export default function CreateForm() {
  const router = useRouter();
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="max-w-md w-full p-4">
        <UniversalForm
          action={create}
          schemaName="create"
          fields={[
            {
              name: 'name',
              label: 'Project name',
              placeholder: 'Echospace',
              description: 'How the project is called.',
            },
            {
              name: 'description',
              label: 'Description',
              placeholder: 'A developer-centric user feedback platform.',
              description: 'Describe the project a bit.',
            },
          ]}
          submitText="Submit"
          submitClassname="w-full !mt-5"
          onActionComplete={(res) => {
            // @ts-ignore yea
            if (res && res.id) {
              // @ts-ignore i stopped caring
              router.push(`/project/${res.id}`);
            }
          }}
        />
      </div>
    </div>
  );
}