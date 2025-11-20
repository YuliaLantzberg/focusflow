import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  create(projectId: string, createNoteDto: CreateNoteDto) {
    const { title, content, isPinned } = createNoteDto;
    return this.prisma.projectNote.create({
      data: {
        projectId,
        title,
        content,
        isPinned,
      },
    });
  }

  findAll(projectId: string) {
    return this.prisma.projectNote.findMany({
      where: { projectId },
    });
  }

  async findOne(id: string) {
    const note = await this.prisma.projectNote.findUnique({
      where: { id },
    });

    if (!note) {
      throw new NotFoundException(`Note ${id} is not found`);
    }
    return note;
  }

  update(id: string, updateNoteDto: UpdateNoteDto) {
    return `This action updates a #${id} note`;
  }

  remove(id: string) {
    return `This action removes a #${id} note`;
  }
}
