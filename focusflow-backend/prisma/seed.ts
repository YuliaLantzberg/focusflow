import {
  PrismaClient,
  ProjectStatus,
  TaskPriority,
  TaskStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const saltRounds = 10;

async function main() {
  // 1) Clean data so you can reseed safely
  await prisma.task.deleteMany();
  await prisma.projectNote.deleteMany();
  await prisma.project.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  const SEED_EMAIL = 'testuser@example.com';
  const SEED_PASSWORD = 'Test1234!';

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, saltRounds);

  // One test user
  const user = await prisma.user.create({
    data: {
      email: SEED_EMAIL,
      passwordHash,
      name: 'Test User',
      timezone: 'Asia/Jerusalem',
    },
  });

  // 2) Clients (new domain model)
  const clientsData = [
    {
      companyName: 'Yulia — Internal',
      contactName: 'Yulia',
      email: 'yulia@internal.local',
      phone: null,
      notes: 'Internal client for my own projects (portfolio + FocusFlow).',
    },
    {
      companyName: 'Sunrise Yoga Studio',
      contactName: 'Maya Cohen',
      email: 'maya@sunriseyoga.example',
      phone: '+972-50-123-4567',
      notes: 'Imaginary client: landing + booking improvements.',
    },
    {
      companyName: 'Negev Logistics',
      contactName: 'Avi Levi',
      email: 'avi@negevlogistics.example',
      phone: null,
      notes: 'Imaginary client: internal dashboard work.',
    },
    {
      companyName: 'BlueDot Design',
      contactName: null,
      email: 'hello@bluedotdesign.example',
      phone: null,
      notes: 'Imaginary client: small maintenance tasks.',
    },
  ];

  const clients: Array<{ id: string; companyName: string }> = await Promise.all(
    clientsData.map((c) =>
      prisma.client.create({
        data: {
          ownerId: user.id,
          companyName: c.companyName,
          contactName: c.contactName,
          email: c.email,
          phone: c.phone,
          notes: c.notes,
        },
        select: { id: true, companyName: true },
      }),
    ),
  );

  const getClientId = (companyName: string) =>
    clients.find((c) => c.companyName === companyName)?.id ?? null;

  // 3) Planned projects (no tasks/notes yet)
  const projectsData = [
    {
      name: 'FocusFlow (MVP)',
      description:
        'Project-centric SaaS: Projects, Clients, Kanban tasks, Notes. Portfolio-quality MVP polish.',
      status: 'ACTIVE' as const,
      isVisible: true,
      clientId: getClientId('Yulia — Internal'),
      dueDate: new Date('2026-02-15'),
      budget: 0,
      colorHex: '#7C3AED',
    },
    {
      name: 'Job Search Pipeline',
      description:
        'Track applications, networking, interview prep. Weekly goals and progress.',
      status: 'ACTIVE' as const,
      isVisible: true,
      clientId: getClientId('Yulia — Internal'),
      dueDate: null,
      budget: null,
      colorHex: '#0EA5E9',
    },
    {
      name: 'Freelance: Discovery & Small Gigs',
      description:
        'Light freelance track for extra income without derailing FocusFlow and job search.',
      status: 'PLANNING' as const,
      isVisible: true,
      clientId: null, // no client
      dueDate: null,
      budget: null,
      colorHex: '#22C55E',
    },
    {
      name: 'Sunrise Yoga — Booking Page Refresh',
      description:
        'Landing improvements + simple booking flow UX. Mobile-first.',
      status: 'ACTIVE' as const,
      isVisible: true,
      clientId: getClientId('Sunrise Yoga Studio'),
      dueDate: new Date('2026-02-01'),
      budget: 2500,
      colorHex: '#EC4899',
    },
    {
      name: 'Negev Logistics — Internal Dashboard',
      description: 'Improve filters + export + performance hotspots.',
      status: 'ON_HOLD' as const,
      isVisible: true,
      clientId: getClientId('Negev Logistics'),
      dueDate: null,
      budget: 8000,
      colorHex: '#64748B',
    },
  ];

  const createdProjects: Array<{
    id: string;
    name: string;
    status: ProjectStatus;
  }> = [];
  for (const p of projectsData) {
    const created = await prisma.project.create({
      data: {
        ownerId: user.id,
        name: p.name,
        description: p.description,
        status: p.status,
        isVisible: p.isVisible,
        dueDate: p.dueDate,
        budget: p.budget,
        colorHex: p.colorHex,
        clientId: p.clientId,
      },
      select: { id: true, name: true, status: true },
    });
    createdProjects.push(created);
  }

  const getProjectId = (name: string) =>
    createdProjects.find((p) => p.name === name)?.id ?? null;

  const focusflowId = getProjectId('FocusFlow (MVP)');
  if (!focusflowId) throw new Error('FocusFlow (MVP) project not found');

  const focusflowTasks = [
    // TODO
    {
      title: 'Seed refactor after Client entity introduction',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      order: 100,
    },
    {
      title: 'Project workspace polish (overview, empty states)',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      order: 200,
    },
    {
      title: 'Notes UX placeholder cleanup',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      order: 300,
    },

    // IN_PROGRESS
    {
      title: 'Stabilize task ordering edge cases (renormalization)',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      order: 100,
    },
    {
      title: 'Improve API error UX (409 ON_HOLD)',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      order: 200,
    },

    // BLOCKED
    {
      title: 'Auth hardening pass (guards + audit)',
      status: TaskStatus.BLOCKED,
      priority: TaskPriority.MEDIUM,
      order: 100,
    },

    // DONE
    {
      title: 'Client entity integrated into backend (relations + DTOs)',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      order: 100,
    },
    {
      title: 'Project status semantics enforced (ON_HOLD gating)',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      order: 200,
    },
  ];

  await prisma.task.createMany({
    data: focusflowTasks.map((t) => ({
      projectId: focusflowId,
      title: t.title,
      status: t.status,
      priority: t.priority,
      order: t.order,
      // keep the rest null/default to avoid schema mismatch surprises
    })),
  });

  await prisma.projectNote.createMany({
    data: [
      {
        projectId: focusflowId,
        title: 'Next polish targets',
        content:
          'Tighten empty states, confirm seed realism, and keep ownership enforcement clean.',
        isPinned: true,
        isVisible: true,
      },
      {
        projectId: focusflowId,
        title: 'Architecture reminders',
        content:
          'Never accept ownerId from client. Use server-side req.user.userId and Prisma relations properly.',
        isPinned: false,
        isVisible: true,
      },
    ],
  });

  console.log('✅ Seed completed: user + clients + planned projects.');
  console.log(`Login: testuser@example.com / Test1234!`);
  console.log(`Projects created: ${createdProjects.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
