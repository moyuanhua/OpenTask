import { IsString, IsOptional, IsUUID } from 'class-validator';

export class ReviewApprovalDto {
  @IsOptional()
  @IsString()
  reviewedBy?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class RequestApprovalDto {
  @IsUUID()
  taskId: string;

  @IsOptional()
  @IsString()
  requestedBy?: string;

  @IsOptional()
  context?: Record<string, unknown>;
}
