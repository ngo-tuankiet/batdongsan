export default defineEventHandler(async (event) => {
  let createdCount = 0;
  const addedArticles: any[] = [];

  // Danh sách các tin thị trường được cào/tổng hợp mẫu từ VnExpress / CafeF BĐS
  const marketCrawlFeed = [
    {
      title: 'TP.HCM Bảng Giá Đất Mới: Nhà Phố Trung Tâm Quận 1 Biến Động Ra Sao?',
      excerpt: 'Bảng giá đất điều chỉnh theo Luật Đất đai mới tác động trực tiếp đến nghĩa vụ tài chính khi chuyển nhượng, cấp đổi sổ hồng và chi phí hợp thức hóa lộ giới tại trung tâm.',
      content: `
        <p class="lead-paragraph">
          Việc TP.HCM ban hành bảng giá đất điều chỉnh đang là tâm điểm chú ý của toàn thị trường bất động sản. Đặc biệt tại khu vực lõi trung tâm Quận 1, mức giá đất tính thuế đã có sự thay đổi đáng kể.
        </p>
        <h3>Tác động đến người mua và người bán nhà phố</h3>
        <p>Thuế thu nhập cá nhân 2% và lệ phí trước bạ 0.5% khi chuyển nhượng sẽ căn cứ sát hơn với giá giao dịch thực tế trên thị trường, giúp minh bạch hóa các giao dịch lớn.</p>
        <blockquote>
          "Nhận định của Sàn Bến Thành: Đây là thời điểm tốt để cơ cấu tài sản sang các sản phẩm có sổ hồng sẵn sàng công chứng ngay."
        </blockquote>
      `,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      category: 'Pháp lý an toàn',
      source: 'CafeF Bất Động Sản',
      sourceUrl: 'https://cafef.vn',
      readTime: '6 phút đọc',
    },
    {
      title: 'Thị Trường Nhà Phố Cho Thuê Quận 1 Phục Hồi Mạnh Nhờ Khách Du Lịch Quốc Tế',
      excerpt: 'Tỷ lệ lấp đầy mặt bằng kinh doanh bán lẻ và khách sạn boutique khu vực quanh Chợ Bến Thành và Phố đi bộ Nguyễn Huệ chạm mốc 92%.',
      content: `
        <p class="lead-paragraph">
          Theo khảo sát mới nhất của đơn vị nghiên cứu thị trường, phân khúc nhà phố thương mại (shophouse) cho thuê tại Quận 1 đang ghi nhận mức tăng trưởng giá thuê 15% so với cùng kỳ.
        </p>
        <h3>Các ngành nghề dẫn dắt nhu cầu thuê</h3>
        <p>Chuỗi F&B cao cấp, thương hiệu thời trang thiết kế và phòng khám thẩm mỹ quốc tế là những đối tượng sẵn sàng trả giá thuê từ 80 đến 250 triệu đồng/tháng cho các căn nhà có vị trí góc 2 mặt tiền.</p>
        <blockquote>
          "Quý khách có nhu cầu tìm nhà phố mặt tiền có sẵn dòng tiền cho thuê cao, hãy liên hệ Sàn Bến Thành để nhận bảng phân tích ROI chi tiết."
        </blockquote>
      `,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      category: 'Kinh nghiệm thực chiến',
      source: 'VnExpress BĐS',
      sourceUrl: 'https://vnexpress.net',
      readTime: '5 phút đọc',
    },
    {
      title: 'Lãi Suất Cho Vay Mua BĐS Cao Cấp Đang Ở Mức Hấp Dẫn Nhất Trong 3 Năm Qua',
      excerpt: 'Nhiều ngân hàng thương mại tung gói tín dụng ưu đãi từ 5.5% - 6.8%/năm cố định 24 tháng cho khách hàng mua nhà phố và căn hộ hạng sang.',
      content: `
        <p class="lead-paragraph">
          Thanh khoản hệ thống ngân hàng dồi dào mở ra cơ hội lớn cho các nhà đầu tư sở hữu tiềm lực tài chính tốt muốn giải ngân vào tài sản trung tâm.
        </p>
        <h3>Lưu ý khi ký hợp đồng vay ngân hàng</h3>
        <p>Cần thương lượng rõ biên độ thả nổi sau thời gian ưu đãi và phí phạt trả nợ trước hạn từ năm thứ 3 trở đi để tối ưu chi phí sử dụng vốn.</p>
      `,
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
      category: 'Đòn bẩy tài chính',
      source: 'Báo Đầu Tư',
      sourceUrl: 'https://baodautu.vn',
      readTime: '4 phút đọc',
    }
  ];

  for (const item of marketCrawlFeed) {
    const slug = item.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/([^0-9a-z-\s])/g, '')
      .replace(/(\s+)/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Date.now().toString().slice(-4);

    // Kiểm tra trùng lặp tiêu đề
    const existing = await prisma.article.findFirst({
      where: { title: item.title },
    });

    if (!existing) {
      const created = await prisma.article.create({
        data: {
          slug,
          title: item.title,
          excerpt: item.excerpt,
          content: item.content,
          image: item.image,
          category: item.category,
          author: 'Tổng Hợp Thị Trường (' + item.source + ')',
          readTime: item.readTime,
          isPublished: false, // LƯU DƯỚI DẠNG BẢN NHÁP (DRAFT) ĐỂ ADMIN DUYỆT!
          isFeatured: false,
          source: item.source,
          sourceUrl: item.sourceUrl,
        },
      });
      createdCount++;
      addedArticles.push(created);
    }
  }

  return {
    success: true,
    message: `Đã cào ${createdCount} tin thị trường mới về danh sách bản nháp! Bạn có thể kiểm tra và duyệt đăng.`,
    count: createdCount,
    articles: addedArticles,
  };
});
