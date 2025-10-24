#!/bin/bash

echo "🚀 NodeBlog Deployment Script"
echo "=============================="

# Renklendirme
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Git durumunu kontrol et
echo -e "${BLUE}📋 Git durumu kontrol ediliyor...${NC}"
if [ -d ".git" ]; then
    echo -e "${GREEN}✅ Git repository mevcut${NC}"
else
    echo -e "${YELLOW}⚠️  Git repository bulunamadı. Başlatılıyor...${NC}"
    git init
    echo -e "${GREEN}✅ Git repository başlatıldı${NC}"
fi

# 2. Dependencies kontrol et
echo -e "${BLUE}📦 Dependencies kontrol ediliyor...${NC}"
if [ -f "package.json" ]; then
    echo -e "${GREEN}✅ package.json mevcut${NC}"
    npm install
    echo -e "${GREEN}✅ Dependencies yüklendi${NC}"
else
    echo -e "${RED}❌ package.json bulunamadı!${NC}"
    exit 1
fi

# 3. Environment dosyasını kontrol et
echo -e "${BLUE}🔧 Environment dosyası kontrol ediliyor...${NC}"
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ .env dosyası mevcut${NC}"
else
    echo -e "${YELLOW}⚠️  .env dosyası bulunamadı!${NC}"
    echo -e "${YELLOW}Lütfen .env dosyasını oluşturun ve MongoDB Atlas bilgilerini ekleyin${NC}"
fi

# 4. Vercel konfigürasyonunu kontrol et
echo -e "${BLUE}⚙️  Vercel konfigürasyonu kontrol ediliyor...${NC}"
if [ -f "vercel.json" ]; then
    echo -e "${GREEN}✅ vercel.json mevcut${NC}"
else
    echo -e "${RED}❌ vercel.json bulunamadı!${NC}"
    exit 1
fi

# 5. Git'e ekle ve commit et
echo -e "${BLUE}📤 Git'e ekleniyor...${NC}"
git add .
git status

echo -e "${YELLOW}Commit mesajı girin (Enter'a basın varsayılan mesaj için):${NC}"
read commit_message

if [ -z "$commit_message" ]; then
    commit_message="Production deployment hazırlığı"
fi

git commit -m "$commit_message"

# 6. Remote repository kontrol et
echo -e "${BLUE}🌐 Remote repository kontrol ediliyor...${NC}"
if git remote get-url origin > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Remote repository mevcut${NC}"
    git push origin main
    echo -e "${GREEN}✅ Kod GitHub'a yüklendi${NC}"
else
    echo -e "${YELLOW}⚠️  Remote repository bulunamadı${NC}"
    echo -e "${YELLOW}GitHub repository URL'sini girin:${NC}"
    read repo_url
    
    if [ ! -z "$repo_url" ]; then
        git remote add origin $repo_url
        git branch -M main
        git push -u origin main
        echo -e "${GREEN}✅ Kod GitHub'a yüklendi${NC}"
    else
        echo -e "${RED}❌ Repository URL girilmedi!${NC}"
    fi
fi

# 7. Deployment talimatları
echo -e "${GREEN}🎉 Hazırlık tamamlandı!${NC}"
echo ""
echo -e "${BLUE}📋 Sonraki adımlar:${NC}"
echo "1. MongoDB Atlas hesabı oluşturun: https://www.mongodb.com/atlas"
echo "2. Cluster oluşturun ve connection string alın"
echo "3. Vercel hesabı oluşturun: https://vercel.com"
echo "4. GitHub repository'nizi Vercel'e bağlayın"
echo "5. Environment variables'ları ekleyin"
echo "6. Deploy edin!"
echo ""
echo -e "${YELLOW}📖 Detaylı rehber: DEPLOYMENT_REHBERI.md dosyasını okuyun${NC}"
echo ""
echo -e "${GREEN}🚀 Başarılar!${NC}"
