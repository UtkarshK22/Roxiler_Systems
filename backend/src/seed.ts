import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './common/entities/user.entity';
import { Store } from './common/entities/store.entity';
import { Rating } from './common/entities/rating.entity';

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_DATABASE ?? 'roxiler',
    entities: [User, Store, Rating],
    synchronize: false,
  });

  await dataSource.initialize();
  const userRepo = dataSource.getRepository(User);
  const storeRepo = dataSource.getRepository(Store);
  const ratingRepo = dataSource.getRepository(Rating);

  const saltRounds = 12;

  // 1 Admin (name must be 20+ chars)
  const adminPassword = await bcrypt.hash('AdminPass123!', saltRounds);
  const admin = userRepo.create({
    name: 'System Administrator Roxiler',
    email: 'admin@roxiler.com',
    password_hash: adminPassword,
    address: 'Roxiler Systems, 5th Floor, Cyber Towers, HITEC City, Hyderabad 500081',
    role: UserRole.SYSTEM_ADMIN,
  });
  await userRepo.save(admin);

  // 2 Store Owners
  const owner1Password = await bcrypt.hash('OwnerPass123!', saltRounds);
  const owner1 = userRepo.create({
    name: 'Priya Venkatesh Ramanathan',
    email: 'priya.ramanathan@roxiler.com',
    password_hash: owner1Password,
    address: '12 Besant Nagar Beach Road, Chennai, Tamil Nadu 600090',
    role: UserRole.STORE_OWNER,
  });
  await userRepo.save(owner1);

  const owner2Password = await bcrypt.hash('OwnerPass123!', saltRounds);
  const owner2 = userRepo.create({
    name: 'Rohan Deshpande Kulkarni',
    email: 'rohan.kulkarni@roxiler.com',
    password_hash: owner2Password,
    address: '45 Koregaon Park Lane 7, Pune, Maharashtra 411001',
    role: UserRole.STORE_OWNER,
  });
  await userRepo.save(owner2);

  // Stores for owners
  const store1 = storeRepo.create({
    name: 'Ramanathan Electronics Emporium',
    email: 'priya.electronics@roxiler.com',
    address: '14 Anna Salai, Chennai, Tamil Nadu 600002',
    owner_id: owner1.id,
  });
  await storeRepo.save(store1);

  const store2 = storeRepo.create({
    name: 'Kulkarni Fresh Grocery Mart',
    email: 'rohan.grocery@roxiler.com',
    address: '22 Fergusson College Road, Pune, Maharashtra 411004',
    owner_id: owner2.id,
  });
  await storeRepo.save(store2);

  // 3 Normal Users
  const user1Password = await bcrypt.hash('UserPass123!', saltRounds);
  const user1 = userRepo.create({
    name: 'Ananya Sharma Bhattacharya',
    email: 'ananya.bhattacharya@roxiler.com',
    password_hash: user1Password,
    address: '8B Lake Gardens, Kolkata, West Bengal 700045',
    role: UserRole.NORMAL_USER,
  });
  await userRepo.save(user1);

  const user2Password = await bcrypt.hash('UserPass123!', saltRounds);
  const user2 = userRepo.create({
    name: 'Vikram Singh Rajput Chauhan',
    email: 'vikram.chauhan@roxiler.com',
    password_hash: user2Password,
    address: '27 Civil Lines, Jaipur, Rajasthan 302006',
    role: UserRole.NORMAL_USER,
  });
  await userRepo.save(user2);

  const user3Password = await bcrypt.hash('UserPass123!', saltRounds);
  const user3 = userRepo.create({
    name: 'Meera Krishnan Subramanian',
    email: 'meera.subramanian@roxiler.com',
    password_hash: user3Password,
    address: '63 Anna Nagar West, Chennai, Tamil Nadu 600040',
    role: UserRole.NORMAL_USER,
  });
  await userRepo.save(user3);

  // Sample ratings
  const rating1 = ratingRepo.create({
    user_id: user1.id,
    store_id: store1.id,
    rating: 5,
  });
  await ratingRepo.save(rating1);

  const rating2 = ratingRepo.create({
    user_id: user2.id,
    store_id: store1.id,
    rating: 4,
  });
  await ratingRepo.save(rating2);

  const rating3 = ratingRepo.create({
    user_id: user3.id,
    store_id: store2.id,
    rating: 3,
  });
  await ratingRepo.save(rating3);

  const rating4 = ratingRepo.create({
    user_id: user1.id,
    store_id: store2.id,
    rating: 5,
  });
  await ratingRepo.save(rating4);

  console.log('Seed completed successfully');
  console.log('Admin: admin@roxiler.com / AdminPass123!');
  console.log('Owner 1: priya.ramanathan@roxiler.com / OwnerPass123!');
  console.log('Owner 2: rohan.kulkarni@roxiler.com / OwnerPass123!');
  console.log('User 1: ananya.bhattacharya@roxiler.com / UserPass123!');
  console.log('User 2: vikram.chauhan@roxiler.com / UserPass123!');
  console.log('User 3: meera.subramanian@roxiler.com / UserPass123!');

  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});