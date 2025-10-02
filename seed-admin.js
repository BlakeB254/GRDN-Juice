const bcrypt = require('bcryptjs');
const { neon } = require('@neondatabase/serverless');

const sql = neon('postgresql://neondb_owner:npg_2pEiNJCzFc0v@ep-bitter-shadow-adxhl3x5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

async function seedAdminUser() {
  try {
    console.log('🔐 Seeding admin user with proper password hash...');
    
    // Hash the admin password
    const password = 'Codex450!!';
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    console.log('✅ Password hashed successfully');
    console.log('   Hash length:', hashedPassword.length);
    console.log('   Hash starts with:', hashedPassword.substring(0, 10));
    
    // Check if admin user exists
    const existingUser = await sql`
      SELECT id, email, password FROM users WHERE email = 'codexmetatron@gmail.com' LIMIT 1
    `;
    
    if (existingUser.length > 0) {
      console.log('📝 Admin user exists, updating password hash...');
      
      // Update existing user
      await sql`
        UPDATE users 
        SET password = ${hashedPassword}, 
            updated_at = NOW(),
            is_active = true,
            email_verified = true
        WHERE email = 'codexmetatron@gmail.com'
      `;
      
      console.log('✅ Admin password updated successfully');
    } else {
      console.log('👤 Creating new admin user...');
      
      // Create new admin user
      await sql`
        INSERT INTO users (email, password, first_name, last_name, role, is_active, email_verified, created_at, updated_at)
        VALUES (
          'codexmetatron@gmail.com',
          ${hashedPassword},
          'Admin',
          'User', 
          'admin',
          true,
          true,
          NOW(),
          NOW()
        )
      `;
      
      console.log('✅ Admin user created successfully');
    }
    
    // Verify the user was created/updated
    const verifyUser = await sql`
      SELECT id, email, role, password, is_active FROM users WHERE email = 'codexmetatron@gmail.com' LIMIT 1
    `;
    
    if (verifyUser.length > 0) {
      const user = verifyUser[0];
      console.log('🔍 Verification:');
      console.log('   Email:', user.email);
      console.log('   Role:', user.role);
      console.log('   Active:', user.is_active);
      console.log('   Password hash length:', user.password?.length || 'NOT SET');
      console.log('   Hash is bcrypt format:', user.password?.startsWith('$2') || false);
      
      // Test password verification
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log('   Password verification test:', isValidPassword ? '✅ SUCCESS' : '❌ FAILED');
    }
    
    console.log('🎉 Admin user seeding complete!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seedAdminUser();