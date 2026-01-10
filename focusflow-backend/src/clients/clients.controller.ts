import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateClientDto } from './dto/create-client.dto';
import { ClientsService } from './clients.service';

type AuthReq = { user: { userId: string } };

@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}
  @Post()
  create(@Req() req: AuthReq, @Body() dto: CreateClientDto) {
    return this.clientsService.create(req.user.userId, dto);
  }
}
