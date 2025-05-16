
-- Example SQL queries for common operations in the MedConnect application

-- 1. User Authentication and Management

-- Register a new patient
SELECT register_user('John', 'Doe', 'john.doe@example.com', '555-123-4567', 'patient', 'secure_password');

-- Register a new doctor
SELECT register_user('Dr. Jane', 'Smith', 'dr.smith@example.com', '555-987-6543', 'doctor', 'secure_password');

-- Update user profile
UPDATE users
SET 
  phone = '555-111-2222',
  profile_image_url = 'https://example.com/profile.jpg'
WHERE id = 'user_uuid_here';

-- Get user profile with role-specific information
SELECT 
  u.*,
  CASE 
    WHEN u.role = 'patient' THEN (
      SELECT row_to_json(p.*) 
      FROM patients p 
      WHERE p.id = u.id
    )
    WHEN u.role IN ('doctor', 'nurse') THEN (
      SELECT row_to_json(hp.*) 
      FROM healthcare_providers hp 
      WHERE hp.id = u.id
    )
    ELSE NULL
  END as role_data
FROM users u
WHERE u.id = 'user_uuid_here';

-- 2. Appointment Management

-- Create a new appointment
INSERT INTO appointments (
  patient_id, provider_id, title, description, 
  start_time, end_time, location, is_virtual
) VALUES (
  'patient_uuid_here',
  'provider_uuid_here',
  'Annual Check-up',
  'Regular annual physical examination',
  '2023-06-15 10:00:00+00',
  '2023-06-15 10:30:00+00',
  'Main Clinic, Room 204',
  false
);

-- Get upcoming appointments for a patient
SELECT * FROM get_upcoming_appointments('patient_uuid_here');

-- Get upcoming appointments for a provider
SELECT * FROM get_upcoming_appointments('provider_uuid_here');

-- Reschedule an appointment
UPDATE appointments
SET 
  start_time = '2023-06-20 14:00:00+00',
  end_time = '2023-06-20 14:30:00+00',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'appointment_uuid_here';

-- Cancel an appointment
UPDATE appointments
SET 
  status = 'cancelled',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'appointment_uuid_here';

-- Mark appointment as completed
UPDATE appointments
SET 
  status = 'completed',
  notes = 'Patient appeared healthy. Follow-up in 6 months recommended.',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'appointment_uuid_here';

-- 3. Medical Records Management

-- Add a new medical record
INSERT INTO medical_records (
  patient_id, provider_id, visit_date,
  chief_complaint, diagnosis, treatment_plan, notes
) VALUES (
  'patient_uuid_here',
  'provider_uuid_here',
  CURRENT_DATE,
  'Persistent cough and fever',
  ARRAY['Acute bronchitis', 'Seasonal allergies'],
  'Prescribed antibiotics and recommended rest for 3 days',
  'Patient should return if symptoms persist beyond one week'
);

-- Get patient medical history
SELECT 
  mr.*,
  p_user.first_name || ' ' || p_user.last_name AS patient_name,
  hp_user.first_name || ' ' || hp_user.last_name AS provider_name
FROM 
  medical_records mr
  JOIN users p_user ON mr.patient_id = p_user.id
  JOIN users hp_user ON mr.provider_id = hp_user.id
WHERE 
  mr.patient_id = 'patient_uuid_here'
ORDER BY 
  mr.visit_date DESC;

-- 4. Messaging

-- Send a new message
INSERT INTO messages (
  sender_id, recipient_id, subject, body
) VALUES (
  'sender_uuid_here',
  'recipient_uuid_here',
  'Question about medication',
  'I wanted to ask about possible side effects of the medication you prescribed yesterday.'
);

-- Mark message as read
UPDATE messages
SET 
  status = 'read',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'message_uuid_here';

-- Get conversation between two users
SELECT 
  m.*,
  s_user.first_name || ' ' || s_user.last_name AS sender_name
FROM 
  messages m
  JOIN users s_user ON m.sender_id = s_user.id
WHERE 
  (m.sender_id = 'user1_uuid_here' AND m.recipient_id = 'user2_uuid_here') OR
  (m.sender_id = 'user2_uuid_here' AND m.recipient_id = 'user1_uuid_here')
ORDER BY 
  m.created_at ASC;

-- 5. Prescription Management

-- Create a new prescription
INSERT INTO prescriptions (
  patient_id, provider_id, medication_name, dosage, frequency,
  quantity, refills, notes, expiration_date
) VALUES (
  'patient_uuid_here',
  'provider_uuid_here',
  'Amoxicillin',
  '500mg',
  'Three times daily for 10 days',
  30,
  0,
  'Take with food to prevent stomach upset',
  CURRENT_DATE + INTERVAL '1 month'
);

-- Get active prescriptions for a patient
SELECT 
  p.*,
  hp_user.first_name || ' ' || hp_user.last_name AS provider_name
FROM 
  prescriptions p
  JOIN users hp_user ON p.provider_id = hp_user.id
WHERE 
  p.patient_id = 'patient_uuid_here' AND
  p.status = 'active' AND
  (p.expiration_date IS NULL OR p.expiration_date >= CURRENT_DATE)
ORDER BY 
  p.created_at DESC;

-- Mark prescription as filled
UPDATE prescriptions
SET 
  status = 'filled',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'prescription_uuid_here';

-- 6. Business Card Management

-- Create a new business card
INSERT INTO business_cards (
  user_id, title, company, address, city, state, zip,
  phone, email, website, tagline, background_color, text_color
) VALUES (
  'user_uuid_here',
  'Cardiologist',
  'Heart Health Specialists',
  '123 Medical Center Drive',
  'New York',
  'NY',
  '10001',
  '555-123-4567',
  'doctor@example.com',
  'www.heartspecialists.com',
  'Caring for hearts with compassion',
  '#ffffff',
  '#000000'
);

-- Update business card
UPDATE business_cards
SET 
  title = 'Senior Cardiologist',
  logo_url = 'https://example.com/logo.png',
  updated_at = CURRENT_TIMESTAMP
WHERE user_id = 'user_uuid_here';

-- 7. Notification Management

-- Create a notification for an appointment reminder
INSERT INTO notifications (
  user_id, title, message, type, reference_id
) VALUES (
  'user_uuid_here',
  'Appointment Reminder',
  'You have an appointment tomorrow at 10:00 AM with Dr. Smith',
  'appointment',
  'appointment_uuid_here'
);

-- Mark notifications as read
UPDATE notifications
SET is_read = true
WHERE user_id = 'user_uuid_here' AND is_read = false;

-- Get unread notifications for a user
SELECT * 
FROM notifications
WHERE user_id = 'user_uuid_here' AND is_read = false
ORDER BY created_at DESC;
