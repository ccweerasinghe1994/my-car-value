import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, IsNull, Repository } from 'typeorm';
import { CreateReportDto } from '../dto/create-report.dto';
import { UpdateReportDto } from '../dto/update-report.dto';
import { Report } from '../entities/report.entity';

@Injectable()
export class ReportsRepository {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async create(
    createReportDto: CreateReportDto,
    userId: string,
  ): Promise<Report> {
    const report = this.reportRepository.create({
      ...createReportDto,
      userId,
    });
    return this.reportRepository.save(report);
  }

  async findAll(): Promise<Report[]> {
    return this.reportRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Report | null> {
    return this.reportRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['user'],
    });
  }

  async findByUser(userId: string): Promise<Report[]> {
    return this.reportRepository.find({
      where: { userId, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updateReportDto: UpdateReportDto,
  ): Promise<Report | null> {
    const report = await this.findOne(id);
    if (!report) {
      return null;
    }

    Object.assign(report, updateReportDto);
    return this.reportRepository.save(report);
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.reportRepository.softDelete(id);
    return result.affected > 0;
  }

  async findByMakeAndModel(make: string, model: string): Promise<Report[]> {
    return this.reportRepository.find({
      where: {
        make,
        model,
        deletedAt: IsNull(),
        isApproved: true,
      },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByYearRange(minYear: number, maxYear: number): Promise<Report[]> {
    return this.reportRepository.find({
      where: {
        year: Between(minYear, maxYear),
        deletedAt: IsNull(),
        isApproved: true,
      },
      relations: ['user'],
      order: { year: 'DESC' },
    });
  }

  async findApprovedReports(): Promise<Report[]> {
    return this.reportRepository.find({
      where: {
        isApproved: true,
        deletedAt: IsNull(),
      },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAveragePrice(
    make: string,
    model: string,
    year?: number,
  ): Promise<number> {
    const queryBuilder = this.reportRepository
      .createQueryBuilder('report')
      .select('AVG(report.price)', 'averagePrice')
      .where('report.make = :make', { make })
      .andWhere('report.model = :model', { model })
      .andWhere('report.isApproved = :isApproved', { isApproved: true })
      .andWhere('report.deletedAt IS NULL');

    if (year) {
      queryBuilder.andWhere('report.year = :year', { year });
    }

    const result = await queryBuilder.getRawOne();
    return parseFloat(result.averagePrice) || 0;
  }
}
