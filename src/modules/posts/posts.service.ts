import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Post, PostDocument } from './schemas/post.schema'
import { Model, Types } from 'mongoose'
import { PostData } from './dto/create-post.dto'
import { UpdatePostData } from './dto/update-post.dto'
import { QueryPost } from './dto/query-post'

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) { }

  async create(postData: PostData) {
    try {
      const post = await this.postModel.create({ ...postData })
      return post
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findAll(query: QueryPost) {
    try {
      const { page, category } = query
      const filter: Record<string, any> = {}
      if (category) filter.category = category

      let posts = await this.postModel.find(filter)
      return posts
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findOne(id: string) {
    try {
      let post = await this.postModel.findById(id)
      if (!post) throw new NotFoundException('Không tìm thấy bài đăng')
      return post
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async update(id: string, postData: UpdatePostData) {
    try {
      const post = await this.postModel.findOneAndUpdate({ _id: id }, { ...postData }, { new: true })
      if (!post) throw new NotFoundException('Không tìm thấy bài đăng')
      return post
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async remove(id: string) {
    try {
      const post = await this.postModel.findOneAndDelete({ _id: id })
      if (!post) throw new NotFoundException('Không tìm thấy bài đăng')
      return post
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}