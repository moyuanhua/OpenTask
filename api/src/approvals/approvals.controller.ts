import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApprovalsService } from './approvals.service';
import { RequestApprovalDto, ReviewApprovalDto } from './dto/approval.dto';

@Controller('approvals')
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Post()
  request(@Body() dto: RequestApprovalDto) {
    return this.approvalsService.request(dto);
  }

  @Get()
  findAll(@Query('taskId') taskId?: string) {
    return this.approvalsService.findAll(taskId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.approvalsService.findOne(id);
  }

  @Post(':id/approve')
  approve(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ReviewApprovalDto) {
    return this.approvalsService.approve(id, dto);
  }

  @Post(':id/reject')
  reject(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ReviewApprovalDto) {
    return this.approvalsService.reject(id, dto);
  }
}
