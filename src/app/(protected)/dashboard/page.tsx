import ProjectCard from '@/components/app/ProjectCard/ProjectCard';
import { faker } from '@faker-js/faker';

export const dummyData = Array.from({ length: 10 }, (_, id) => ({
  id: id + 1,
  name: faker.word.noun(),
  description: faker.lorem.sentence(),
  github: id !== 5 ? faker.internet.url() : undefined,
}));
export default function Page() {
  return (
    <>
      <h1>Dashboard</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
        {dummyData.map((d) => (
          <ProjectCard key={d.id} {...d} />
        ))}
      </div>
    </>
  );
}
