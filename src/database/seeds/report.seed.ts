import { DataSource } from 'typeorm';
import { Report } from '../../reports/entities/report.entity';
import { User } from '../../users/entities/user.entity';

export async function seedReports(
  dataSource: DataSource,
  users: User[],
): Promise<Report[]> {
  const reportRepository = dataSource.getRepository(Report);

  const reports = [
    {
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      mileage: 25000,
      price: 22000.0,
      longitude: -122.4194,
      latitude: 37.7749,
      description: 'Well-maintained Toyota Camry in excellent condition',
      isApproved: true,
      userId: users[0].id,
    },
    {
      make: 'Honda',
      model: 'Civic',
      year: 2019,
      mileage: 30000,
      price: 18500.0,
      longitude: -74.006,
      latitude: 40.7128,
      description: 'Honda Civic with low mileage, perfect for city driving',
      isApproved: true,
      userId: users[1].id,
    },
    {
      make: 'Ford',
      model: 'Focus',
      year: 2018,
      mileage: 45000,
      price: 15000.0,
      longitude: -87.6298,
      latitude: 41.8781,
      description: 'Ford Focus, good condition, recent service',
      isApproved: false,
      userId: users[2].id,
    },
    {
      make: 'Toyota',
      model: 'Camry',
      year: 2021,
      mileage: 15000,
      price: 25000.0,
      longitude: -118.2437,
      latitude: 34.0522,
      description: 'Nearly new Toyota Camry with warranty',
      isApproved: true,
      userId: users[0].id,
    },
    {
      make: 'BMW',
      model: '3 Series',
      year: 2020,
      mileage: 20000,
      price: 35000.0,
      longitude: -71.0588,
      latitude: 42.3601,
      description: 'Luxury BMW 3 Series in pristine condition',
      isApproved: true,
      userId: users[1].id,
    },
  ];

  const createdReports = [];
  for (const reportData of reports) {
    const report = reportRepository.create(reportData);
    const savedReport = await reportRepository.save(report);
    createdReports.push(savedReport);
    console.log(
      `Created report: ${savedReport.year} ${savedReport.make} ${savedReport.model}`,
    );
  }

  return createdReports;
}
