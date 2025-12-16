import {
  PrismaClient,
  ProjectStatus,
  TaskStatus,
  TaskPriority,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const saltRounds = 10;

async function main() {
  // 1) Clean data so you can reseed safely
  await prisma.task.deleteMany();
  await prisma.projectNote.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Test1234!', saltRounds);

  // One test user
  const user = await prisma.user.create({
    data: {
      email: 'testuser@example.com',
      passwordHash,
      name: 'Test User',
      timezone: 'Asia/Jerusalem',
    },
  });

  // 3) Generate 10 projects, each with 1–10 tasks
  const statusesCycle = [
    ProjectStatus.PLANNING,
    ProjectStatus.ACTIVE,
    ProjectStatus.ON_HOLD,
    ProjectStatus.COMPLETED,
    ProjectStatus.ARCHIVED,
  ];

  const projectsData = Array.from({ length: 10 }, (_, index) => {
    const i = index + 1;
    const tasksCount = ((i - 1) % 10) + 1; // 1..10
    const status = statusesCycle[index % statusesCycle.length];

    return {
      name: `Demo Project ${i}`,
      description: `This is demo project #${i} for UI testing.`,
      status,
      isVisible: i !== 10, // last one invisible, good for testing filters
      clientCompany: `Client Company ${i}`,
      clientContactName: `Contact ${i}`,
      clientContactEmail: `client${i}@example.com`,
      clientContactPhone: `+972-50-000-00${i.toString().padStart(2, '0')}`,
      dueDate: i % 3 === 0 ? null : new Date(`2026-0${(i % 9) + 1}-15`),
      budget: 1000 + i * 250,
      colorHex: ['#3B82F6', '#F97316', '#22C55E', '#EAB308', '#A855F7'][i % 5],
      tasks: Array.from({ length: tasksCount }, (_, taskIndex) => {
        const t = taskIndex + 1;
        return {
          title: `Task ${t} for project ${i}`,
          description: `Demo task ${t} for project ${i}.`,
          status: [
            TaskStatus.TODO,
            TaskStatus.IN_PROGRESS,
            TaskStatus.BLOCKED,
            TaskStatus.DONE,
          ][taskIndex % 4],
          priority: [TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH][
            taskIndex % 3
          ],
          dueDate:
            taskIndex % 2 === 0
              ? new Date(`2026-0${(i % 9) + 1}-2${taskIndex}`)
              : null,
          estimatedMinutes: 30 * (taskIndex + 1),
          timeSpentMinutes: taskIndex % 3 === 0 ? 30 * (taskIndex + 1) : null,
          isBillable: taskIndex % 4 !== 0,
          cost: 50 * (taskIndex + 1),
          order: t,
        };
      }),
      notes: [
        {
          title: `Main note for project ${i}`,
          content: `This is a demo note for project #${i}. Used to test notes UI.`,
          isPinned: i % 3 === 0,
        },
      ],
    };
  });

  // 4) Create all projects with nested tasks & notes
  for (const project of projectsData) {
    await prisma.project.create({
      data: {
        ownerId: user.id,
        name: project.name,
        description: project.description,
        status: project.status,
        isVisible: project.isVisible,
        clientCompany: project.clientCompany,
        clientContactName: project.clientContactName,
        clientContactEmail: project.clientContactEmail,
        clientContactPhone: project.clientContactPhone,
        dueDate: project.dueDate,
        budget: project.budget,
        colorHex: project.colorHex,
        tasks: {
          create: project.tasks.map((task) => ({
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate,
            order: task.order,
            estimatedMinutes: task.estimatedMinutes,
            timeSpentMinutes: task.timeSpentMinutes,
            isBillable: task.isBillable,
            cost: task.cost,
          })),
        },
        notes: {
          create: project.notes.map((note) => ({
            title: note.title,
            content: note.content,
            isPinned: note.isPinned,
          })),
        },
      },
    });
  }

  console.log(
    '✅ Seed completed with 1 user, 10 projects, and 1–10 tasks per project',
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
