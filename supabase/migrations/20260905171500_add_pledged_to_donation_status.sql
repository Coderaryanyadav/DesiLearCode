-- Migration to add 'pledged' status to donation_status ENUM
ALTER TYPE donation_status ADD VALUE IF NOT EXISTS 'pledged';
