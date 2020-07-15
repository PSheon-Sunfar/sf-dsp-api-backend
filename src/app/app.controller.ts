import { Controller, Req, Get, UseGuards } from '@nestjs/common';
import { HealthCheckService, DNSHealthIndicator } from '@nestjs/terminus';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

/**
 * App Controller
 */
@Controller()
@ApiBearerAuth()
export class AppController {
  /**
   * Constructor
   * @param appService
   * @param profileService
   */
  constructor(
    private readonly appService: AppService,
    private health: HealthCheckService,
    private dns: DNSHealthIndicator,
  ) {}

  /**
   * Returns the an environment variable from config file
   * @returns {string} the application environment url
   */
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 200, description: 'Request Received' })
  @ApiResponse({ status: 400, description: 'Request Failed' })
  getString(): string {
    return this.appService.root();
  }

  /**
   * health check
   * @returns {object} api status
   */
  @Get('/health')
  @ApiResponse({ status: 200, description: 'Request Received' })
  @ApiResponse({ status: 400, description: 'Request Failed' })
  healthCheck(): any {
    // return this.appService.root();
    return this.health.check([
      (): any => this.dns.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }

  /**
   * Fetches request metadata
   * @param {Req} req the request body
   * @returns {Partial<Request>} the request user populated from the passport module
   */
  @Get('request/user')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 200, description: 'Request Received' })
  @ApiResponse({ status: 400, description: 'Request Failed' })
  getProfile(@Req() req: Request): Partial<Request> {
    return req.user;
  }
}
