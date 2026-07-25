from fastapi import APIRouter
from typing import List
from schemas import Topic

router = APIRouter(prefix="/api/topics", tags=["Topics"])

TOPICS_DATA: List[Topic] = [
    Topic(
        id="daily-life",
        title="Daily Conversation",
        description="Luyện giao tiếp hằng ngày, tán gẫu về sở thích, thời tiết và cuộc sống.",
        icon="Coffee",
        level="Beginner to Intermediate",
        personas=[
            {
                "id": "friendly-roommate",
                "name": "Alex - Friendly Roommate",
                "role": "Bạn chung nhà thân thiện",
                "description": "Nói chuyện tự nhiên, gần gũi, dùng nhiều từ vựng đời sống hằng ngày.",
                "avatar_icon": "User",
                "initial_message": "Hey there! How was your day today? Did you do anything fun?"
            },
            {
                "id": "coffee-barista",
                "name": "Jordan - Coffee Shop Barista",
                "role": "Nhân viên quán cà phê",
                "description": "Luyện gọi món, trò chuyện nhẹ nhàng buổi sáng.",
                "avatar_icon": "Coffee",
                "initial_message": "Good morning! Welcome to StarBeans. What can I get started for you today?"
            }
        ]
    ),
    Topic(
        id="travel",
        title="Travel & Airport",
        description="Thực hành khi du lịch nước ngoài, làm thủ tục sân bay, hỏi đường, khách sạn.",
        icon="Plane",
        level="Intermediate",
        personas=[
            {
                "id": "customs-officer",
                "name": "Officer Smith - Immigration Officer",
                "role": "Nhân viên hải quan sân bay",
                "description": "Hỏi đáp về lý do chuyến đi, thời gian lưu trú và nơi ở.",
                "avatar_icon": "ShieldCheck",
                "initial_message": "Good day! Passport and landing card, please. What is the main purpose of your visit to the UK?"
            },
            {
                "id": "hotel-receptionist",
                "name": "Emma - Hotel Front Desk Agent",
                "role": "Lễ tân khách sạn",
                "description": "Thực hành check-in, yêu cầu dịch vụ phòng.",
                "avatar_icon": "Hotel",
                "initial_message": "Welcome to The Grand Resort! Are you checking in today?"
            }
        ]
    ),
    Topic(
        id="job-interview",
        title="Job Interview",
        description="Luyện phỏng vấn xin việc, trả lời câu hỏi về kinh nghiệm, điểm mạnh và mục tiêu.",
        icon="Briefcase",
        level="Upper-Intermediate",
        personas=[
            {
                "id": "hr-manager",
                "name": "Sarah Jenkins - Senior HR Manager",
                "role": "Nhà tuyển dụng chuyên nghiệp",
                "description": "Đặt câu hỏi phỏng vấn chuẩn doanh nghiệp, chú trọng phản xạ chuẩn mực.",
                "avatar_icon": "UserCheck",
                "initial_message": "Welcome to our office! Thank you for coming in today. To start off, could you tell me a little about yourself and your background?"
            }
        ]
    ),
    Topic(
        id="restaurant",
        title="Restaurant & Dining",
        description="Luyện đặt bàn, gọi món ăn, hỏi về thực đơn và thanh toán hóa đơn.",
        icon="Utensils",
        level="Beginner",
        personas=[
            {
                "id": "bistro-waiter",
                "name": "Marco - Fine Dining Waiter",
                "role": "Phục vụ nhà hàng",
                "description": "Giao tiếp khi ăn uống, gợi ý món ăn ngon.",
                "avatar_icon": "UtensilsCrossed",
                "initial_message": "Good evening, welcome to La Dolce Vita! Here is your menu. Have you decided on your drinks yet?"
            }
        ]
    ),
    Topic(
        id="business-meeting",
        title="Business Meeting",
        description="Thực hành phát biểu ý kiến, thảo luận tiến độ công việc và thuyết trình ngắn.",
        icon="TrendingUp",
        level="Advanced",
        personas=[
            {
                "id": "project-lead",
                "name": "David Miller - Product Director",
                "role": "Giám đốc sản phẩm",
                "description": "Luyện tiếng Anh công sở (Business English), đàm phán và trao đổi dự án.",
                "avatar_icon": "Target",
                "initial_message": "Thanks for joining the sync team! Let's review the Q3 launch milestone. What updates do you have for us today?"
            }
        ]
    ),
    Topic(
        id="ielts-speaking",
        title="IELTS Speaking Practice",
        description="Luyện thi IELTS Speaking Part 1, 2, 3 với nhận xét chấm điểm tiêu chuẩn.",
        icon="Award",
        level="Academic",
        personas=[
            {
                "id": "ielts-examiner",
                "name": "Dr. Richard Vance - Certified Examiner",
                "role": "Giám khảo thi IELTS",
                "description": "Hỏi các chủ đề IELTS Speaking chuẩn phom thi thật.",
                "avatar_icon": "GraduationCap",
                "initial_message": "Good afternoon. My name is Dr. Vance. Could you state your full name and where you are from, please?"
            }
        ]
    )
]

@router.get("", response_model=List[Topic])
async def get_topics():
    return TOPICS_DATA

@router.get("/{topic_id}", response_model=Topic)
async def get_topic_by_id(topic_id: str):
    for topic in TOPICS_DATA:
        if topic.id == topic_id:
            return topic
    return TOPICS_DATA[0]
