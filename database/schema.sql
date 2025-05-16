
-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.settings.app_id" = 'medconnect';

-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Create custom types
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'nurse', 'admin');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show');
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read');
CREATE TYPE prescription_status AS ENUM ('active', 'inactive', 'expired', 'filled');
CREATE TYPE notification_type AS ENUM ('appointment', 'message', 'prescription', 'system');

-- Users Table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'patient',
  profile_image_url TEXT,
  date_of_birth DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Patients Table (extends users for patient-specific data)
CREATE TABLE patients (
  id UUID REFERENCES users(id) PRIMARY KEY,
  medical_record_number TEXT UNIQUE,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  blood_type TEXT,
  allergies TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Healthcare Providers Table (extends users for provider-specific data)
CREATE TABLE healthcare_providers (
  id UUID REFERENCES users(id) PRIMARY KEY,
  specialty TEXT,
  license_number TEXT,
  license_state TEXT,
  npi_number TEXT,
  practice_name TEXT,
  practice_address TEXT,
  practice_city TEXT,
  practice_state TEXT,
  practice_zip TEXT,
  practice_phone TEXT,
  practice_email TEXT,
  schedule_hours JSONB, -- Store availability schedule as JSON
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Appointments Table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) NOT NULL,
  provider_id UUID REFERENCES healthcare_providers(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status appointment_status NOT NULL DEFAULT 'scheduled',
  location TEXT,
  notes TEXT,
  is_virtual BOOLEAN DEFAULT FALSE,
  virtual_meeting_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Medical Records Table
CREATE TABLE medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) NOT NULL,
  provider_id UUID REFERENCES healthcare_providers(id) NOT NULL,
  visit_date DATE NOT NULL,
  chief_complaint TEXT,
  diagnosis TEXT[],
  treatment_plan TEXT,
  notes TEXT,
  follow_up_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Messages Table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id) NOT NULL,
  recipient_id UUID REFERENCES users(id) NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  status message_status NOT NULL DEFAULT 'sent',
  parent_message_id UUID REFERENCES messages(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Prescriptions Table
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) NOT NULL,
  provider_id UUID REFERENCES healthcare_providers(id) NOT NULL,
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  duration TEXT,
  quantity INTEGER,
  refills INTEGER DEFAULT 0,
  status prescription_status NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expiration_date DATE
);

-- Business Cards Table
CREATE TABLE business_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  title TEXT,
  company TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  tagline TEXT,
  background_color TEXT,
  text_color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL DEFAULT 'system',
  reference_id UUID, -- Can refer to appointment_id, message_id, etc.
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_provider_id ON appointments(provider_id);
CREATE INDEX idx_appointments_start_time ON appointments(start_time);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_provider_id ON prescriptions(provider_id);
CREATE INDEX idx_medical_records_patient_id ON medical_records(patient_id);

-- Add Row Level Security Policies
-- Users table policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_select_policy ON users
  FOR SELECT USING (
    auth.uid() = id OR -- Users can read their own records
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'doctor', 'nurse'))
  );

CREATE POLICY users_insert_policy ON users
  FOR INSERT WITH CHECK (auth.uid() = id OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY users_update_policy ON users
  FOR UPDATE USING (auth.uid() = id OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Similar policies for other tables
-- Appointments policies
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY appointments_select_policy ON appointments
  FOR SELECT USING (
    auth.uid() = patient_id OR 
    auth.uid() = provider_id OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'nurse'))
  );

-- Similarly define RLS policies for all other tables

-- Create functions for common operations
-- Function to get upcoming appointments for a user
CREATE OR REPLACE FUNCTION get_upcoming_appointments(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  status appointment_status,
  patient_name TEXT,
  provider_name TEXT,
  location TEXT,
  is_virtual BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.title,
    a.description,
    a.start_time,
    a.end_time,
    a.status,
    p_user.first_name || ' ' || p_user.last_name AS patient_name,
    hp_user.first_name || ' ' || hp_user.last_name AS provider_name,
    a.location,
    a.is_virtual
  FROM 
    appointments a
    JOIN patients p ON a.patient_id = p.id
    JOIN users p_user ON p.id = p_user.id
    JOIN healthcare_providers hp ON a.provider_id = hp.id
    JOIN users hp_user ON hp.id = hp_user.id
  WHERE 
    (a.patient_id = p_user_id OR a.provider_id = p_user_id) AND
    a.start_time > CURRENT_TIMESTAMP AND
    a.status NOT IN ('cancelled', 'no_show')
  ORDER BY 
    a.start_time ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to get recent messages for a user
CREATE OR REPLACE FUNCTION get_recent_messages(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  sender_id UUID,
  sender_name TEXT,
  recipient_id UUID,
  recipient_name TEXT,
  subject TEXT,
  body TEXT,
  status message_status,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.sender_id,
    s_user.first_name || ' ' || s_user.last_name AS sender_name,
    m.recipient_id,
    r_user.first_name || ' ' || r_user.last_name AS recipient_name,
    m.subject,
    m.body,
    m.status,
    m.created_at
  FROM 
    messages m
    JOIN users s_user ON m.sender_id = s_user.id
    JOIN users r_user ON m.recipient_id = r_user.id
  WHERE 
    m.sender_id = p_user_id OR m.recipient_id = p_user_id
  ORDER BY 
    m.created_at DESC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql;

-- Function to register a new user
CREATE OR REPLACE FUNCTION register_user(
  p_first_name TEXT,
  p_last_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_role user_role,
  p_password TEXT -- This will be handled securely by Supabase Auth
) RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Create auth user (this would be handled by Supabase Auth)
  -- v_user_id := auth.sign_up(p_email, p_password);
  
  -- For this example, we'll just generate a random UUID
  v_user_id := gen_random_uuid();
  
  -- Insert into users table
  INSERT INTO users (
    id, first_name, last_name, email, phone, role
  ) VALUES (
    v_user_id, p_first_name, p_last_name, p_email, p_phone, p_role
  );
  
  -- If role is patient, also insert into patients table
  IF p_role = 'patient' THEN
    INSERT INTO patients (id) VALUES (v_user_id);
  END IF;
  
  -- If role is doctor or nurse, also insert into healthcare_providers table
  IF p_role IN ('doctor', 'nurse') THEN
    INSERT INTO healthcare_providers (id) VALUES (v_user_id);
  END IF;
  
  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update timestamp columns
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all tables with updated_at
CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_patients_timestamp
BEFORE UPDATE ON patients
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_healthcare_providers_timestamp
BEFORE UPDATE ON healthcare_providers
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_appointments_timestamp
BEFORE UPDATE ON appointments
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_medical_records_timestamp
BEFORE UPDATE ON medical_records
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_messages_timestamp
BEFORE UPDATE ON messages
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_prescriptions_timestamp
BEFORE UPDATE ON prescriptions
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_business_cards_timestamp
BEFORE UPDATE ON business_cards
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
