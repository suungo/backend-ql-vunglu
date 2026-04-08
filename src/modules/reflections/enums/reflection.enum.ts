export enum ReflectionStatus {
  PENDING = 'PENDING', // Chờ xử lý
  IN_PROGRESS = 'IN_PROGRESS', // Đang xử lý
  RESOLVED = 'RESOLVED', // Đã xử lý
  REJECTED = 'REJECTED', // Từ chối
}

export enum EventType {
  RAIN = "RAIN", // Mưa
  TIDE = "TIDE", // Mực nước
  FLOOD = "FLOOD", // Lũ lụt
  DYKE_BREAK = "DYKE_BREAK", // Vỡ đê
  // sạt lở
  LANDSLIDE = "LANDSLIDE", // Sạt lở
  OTHER = "OTHER", // Loại khác
}

// Mức độ
export enum Priority {
  LOW = "LOW", // Thấp
  MEDIUM = "MEDIUM", // Trung bình
  HIGH = "HIGH", // Cao
}


// Loại danh mục
export enum Category {
  INFRASTRUCTURE = "INFRASTRUCTURE", // Hạ tầng
  ENVIRONMENT = "ENVIRONMENT", // Môi trường
  SECURITY = "SECURITY", // An ninh trật tự
  OTHER = "OTHER", // Loại khác
}