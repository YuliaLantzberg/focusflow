import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectTasksService } from 'src/projectTasks/projectTasks.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly projectTasksService: ProjectTasksService,
  ) {}

  async create(userId: string, createProjectDto: CreateProjectDto) {
    const { clientId } = createProjectDto;
    if (clientId) {
      const client = await this.prisma.client.findFirst({
        where: { id: clientId, ownerId: userId },
        select: { id: true },
      });
      if (!client) throw new NotFoundException('Client not found');
    }
    return this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        description: createProjectDto.description,
        owner: { connect: { id: userId } },
        ...(createProjectDto.clientId
          ? { client: { connect: { id: createProjectDto.clientId } } }
          : {}),
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.project.findMany({
      where: {
        ownerId: userId,
        isVisible: true,
      },
      include: { client: { select: { companyName: true } } },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(userId: string, id: string) {
    return this.prisma.project.findUnique({
      where: {
        id,
        ownerId: userId,
      },
      include: {
        client: true,
      },
    });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    console.log('Update Project');
    const project = await this.prisma.project.findFirst({
      where: { id, isVisible: true },
      select: { id: true },
    });
    if (!project) throw new NotFoundException('Project not found');
    const { clientId, ...data } = updateProjectDto;
    if (clientId) {
      const client = await this.prisma.client.findFirst({
        where: { id: clientId },
        select: { id: true },
      });
      if (!client) throw new NotFoundException('Client not found');
    }
    return this.prisma.project.update({
      where: { id },
      data: {
        ...data,
        ...(clientId ? { client: { connect: { id: clientId } } } : {}),
      },
    });
  }

  async remove(userId: string, id: string) {
    return this.prisma.project.update({
      where: { id, ownerId: userId },
      data: {
        isVisible: false,
      },
    });
  }

  async updateProjectStatus(projectId: string) {
    return this.projectTasksService.recalcAndPersistProjectStatus(projectId);
  }
}
