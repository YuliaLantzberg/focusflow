import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateClientDto } from './dto/create-client.dto';
import { ClientsService } from './clients.service';
import { UpdateClientDto } from './dto/update-client.dto';

type AuthReq = { user: { userId: string } };

@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}
  @Post()
  create(@Req() req: AuthReq, @Body() dto: CreateClientDto) {
    return this.clientsService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Req() req: AuthReq) {
    return this.clientsService.findAll(req.user.userId);
  }
  @Get(':id')
  findOne(@Req() req: AuthReq, @Param('id') id: string) {
    return this.clientsService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  update(
    @Req() req: AuthReq,
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(req.user.userId, id, updateClientDto);
  }
}
