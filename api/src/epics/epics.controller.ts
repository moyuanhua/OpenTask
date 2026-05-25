import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EpicsService } from './epics.service';
import { CreateEpicDto } from './dto/create-epic.dto';
import { UpdateEpicDto } from './dto/update-epic.dto';

@Controller('epics')
export class EpicsController {
  constructor(private readonly epicsService: EpicsService) {}

  @Post()
  create(@Body() dto: CreateEpicDto) {
    return this.epicsService.create(dto);
  }

  @Get()
  findAll(@Query('projectId') projectId?: string) {
    return this.epicsService.findAll(projectId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.epicsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateEpicDto) {
    return this.epicsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.epicsService.remove(id);
  }
}
