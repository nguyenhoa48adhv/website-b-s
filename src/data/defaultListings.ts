/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LandListing } from '../types';

export const DEFAULT_LISTINGS: LandListing[] = [
  {
    id: 'listing-1',
    title: 'Đất Nền Biệt Thự Dự Án Ven Sông Lam, Gần Cầu Bến Thủy 2',
    type: 'dat-biet-thu',
    price: '4.8 Tỷ',
    priceValue: 4.8,
    size: 250,
    location: 'Xuân An, Nghi Xuân, Hà Tĩnh (Giáp ranh Tp. Vinh)',
    coordinates: { lat: 15.9348, lng: 108.3125 },
    image: '/src/assets/images/lake_front_land_1781076044319.png',
    description: 'Cơ hội sở hữu lô đất biệt thự view sông Lam thơ mộng, giáp ranh thành phố Vinh. Vị trí đắc địa, nằm trên trục đường thông thoáng rộng 12m, đối diện công viên ven sông sinh thái mát mẻ quanh năm. Cách cầu Bến Thủy chỉ ít phút di chuyển, hạ tầng đồng bộ 100%, điện nước đi âm hiện đại. Thích hợp xây dựng nhà vườn nghỉ dưỡng đẳng cấp hoặc đầu tư sinh lời vững chắc.',
    contactName: 'Hoa Nguyễn',
    contactPhone: '0896.234.822',
    legalStatus: 'Sổ đỏ cầm tay, công chứng ngay',
    direction: 'Đông Nam',
    width: 10,
    length: 25,
    isFeatured: true,
    createdAt: '2026-06-05T08:00:00Z'
  },
  {
    id: 'listing-2',
    title: 'Đất Thổ Cư Mặt Đường Lớn Gần Đại Lộ Lê Nin, Thành Phố Vinh',
    type: 'dat-tho-cu',
    price: '3.6 Tỷ',
    priceValue: 3.6,
    size: 100,
    location: 'Nghi Phú, Thành phố Vinh, Nghệ An',
    coordinates: { lat: 15.9875, lng: 108.2312 },
    image: '/src/assets/images/prime_vietnam_land_1781076029635.png',
    description: 'Chính chủ chuyển nhượng lô đất nền thổ cư cực kỳ sạch đẹp kế cận trục Đại lộ Lê Nin sầm uất. Lô đất hướng nhìn trực diện khu lâm viên cây xanh mát mẻ, không dính cống hay trụ điện. Khu dân cư trí thức cao, an ninh nghiêm ngặt, gần các bệnh viện lớn, đặc biệt là Sân bay Vinh và trung tâm hành chính. Giá cực mềm cho khách hàng thiện chí mua ở hoặc đầu tư lâu dài.',
    contactName: 'Hoa Nguyễn',
    contactPhone: '0896.234.822',
    legalStatus: 'Sổ hồng riêng, hỗ trợ vay ngân hàng 70%',
    direction: 'Đông',
    width: 5,
    length: 20,
    isFeatured: true,
    createdAt: '2026-06-08T09:30:00Z'
  },
  {
    id: 'listing-3',
    title: 'Lô Đất Nhà Vườn Sinh Thái Sinh Động Ven Sông Trí, Kỳ Anh, Hà Tĩnh',
    type: 'dat-vuon',
    price: '1.95 Tỷ',
    priceValue: 1.95,
    size: 520,
    location: 'Sông Trí, Thị xã Kỳ Anh, Hà Tĩnh',
    coordinates: { lat: 15.9456, lng: 108.1923 },
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    description: 'Lô đất vườn sinh thái mát mẻ nằm ngay sông Trí hiền hòa thuộc thị xã Kỳ Anh. Trên đất đã trải cỏ mịn màng, trồng sẵn một số cây ăn trái giá trị và có mặt kè bảo vệ kiên cố. Thích hợp cho gia đình phố thị làm nhà vườn thư giãn cuối tuần, hít thở không khí trong lành tự nhiên. Giao thông thuận lợi, trục đường nhựa rộng 6m rộng rãi ô tô ra vào tận nơi thoải mái.',
    contactName: 'Hoa Nguyễn',
    contactPhone: '0896.234.822',
    legalStatus: 'Sổ đỏ chính chủ, đất vườn cây lâu năm',
    direction: 'Nam',
    width: 15,
    length: 34.6,
    isFeatured: false,
    createdAt: '2026-06-09T14:15:00Z'
  },
  {
    id: 'listing-4',
    title: 'Đất Nền Trục Quy Hoạch Hà Huy Tập, Trung Tâm Thành Phố Hà Tĩnh',
    type: 'dat-nen',
    price: '5.5 Tỷ',
    priceValue: 5.5,
    size: 150,
    location: 'Hà Huy Tập, Thành phố Hà Tĩnh',
    coordinates: { lat: 16.0625, lng: 108.2458 },
    image: '/src/assets/images/hero_luxury_background_1781076011248.png',
    description: 'Lô đất vàng cực đẹp mặt tiền đắc địa ngay trung tâm Thành phố Hà Tĩnh, gần trục đường chính Hà Huy Tập. Phù hợp hoàn hảo để xây dựng biệt thự sang trọng, làm tòa nhà văn phòng đại diện, căn hộ dịch vụ cho thuê cao cấp hoặc kinh doanh văn phòng. Chiều ngang mặt tiền 7.5m rộng rãi cực kỳ thuận lợi thiết kế kiến trúc hiện đại.',
    contactName: 'Hoa Nguyễn',
    contactPhone: '0896.234.822',
    legalStatus: 'Sổ hồng lâu dài, đất ở đô thị 100%',
    direction: 'Đông Đông Bắc',
    width: 7.5,
    length: 20,
    isFeatured: true,
    createdAt: '2026-06-01T07:11:00Z'
  }
];
